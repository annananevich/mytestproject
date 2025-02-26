const supertest = require("supertest");
const { expect } = require("chai");
const { authCreateToken, request, logRequest } = require("../src/utils");
const { createBooking } = require("../api/booking/postBooking.js");
const { deleteBookingById } = require("../api/booking/deleteBookingById.js");
const config = require("../config");

describe("API test for creating a booking", function () {
  let token: string;
  let bookingId: number;

  this.timeout(10000);

  it("should create a booking successfully", async function () {
    // Authorization
    token = await authCreateToken();

    // CreateBooking
    const { bookingId: createdBookingId, response } = await createBooking();

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("bookingid");

    // Saving the booking ID
    bookingId = createdBookingId;

    // Comparing the response body with the data sent when creating the booking
    const { bookingid, ...generatedData } = response.body.booking;
    expect(response.body.booking).to.deep.equal(generatedData);

    // Сheck that bookingid is included in the response
    expect(response.body).to.have.property("bookingid").that.equals(bookingId);

    const getResponse = await request
      .get(config.endpoints.bookingById.replace("{id}", bookingId.toString()))
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");

    logRequest(getResponse);

    expect(getResponse.status).to.equal(200);

    // Checking booking data
    expect(getResponse.body.firstname).to.equal(generatedData.firstname);
    expect(getResponse.body.lastname).to.equal(generatedData.lastname);
    expect(getResponse.body.totalprice).to.equal(generatedData.totalprice);
    expect(getResponse.body.depositpaid).to.equal(generatedData.depositpaid);
    expect(getResponse.body.bookingdates.checkin).to.equal(
      generatedData.bookingdates.checkin
    );
    expect(getResponse.body.bookingdates.checkout).to.equal(
      generatedData.bookingdates.checkout
    );
    expect(getResponse.body.additionalneeds).to.equal(
      generatedData.additionalneeds
    );
  });

  after(async function () {
    if (bookingId) {
      const deleteResponse = await deleteBookingById(bookingId, token);

      expect(deleteResponse.status).to.equal(201);
    }
  });
});
