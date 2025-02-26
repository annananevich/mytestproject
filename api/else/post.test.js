const supertest = require("supertest");
const chai = require("chai");
const {
  generateBookingData,
  authCreateToken,
  request,
  expect,
} = require("../../src/utils");
const { logRequest } = require("../../src/utils");
const config = require("../../config");

describe("API test for creating a booking", function () {
  let token;
  let bookingId;

  this.timeout(10000);

  it("should create a booking successfully", async function () {
    // Data Generation
    const data = generateBookingData();

    // Authorization
    token = await authCreateToken();

    // Create booking with generated data
    const response = await request
      .post(config.endpoints.bookings)
      .send(data)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");

    logRequest(response);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("bookingid");

    // Save booking ID for further use
    bookingId = response.body.bookingid;

    // Remove bookingid from the data before comparing
    const { bookingid, ...generatedData } = data;

    // Compare the 'booking' object inside the response body with the generated data
    expect(response.body.booking).to.deep.equal(generatedData);

    // Additional check to verify bookingid is included in the response
    expect(response.body).to.have.property("bookingid").that.equals(bookingId);

    // Check the created booking using GET request
    const getResponse = await request
      .get(config.endpoints.bookingById.replace("{id}", bookingId))
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");

    logRequest(getResponse);

    expect(getResponse.status).to.equal(200);

    // Check if booking data matches
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
      const deleteResponse = await request
        .delete(config.endpoints.deleteBooking.replace("{id}", bookingId))
        .set("Cookie", `token=${token}`);

      logRequest(deleteResponse);

      expect(deleteResponse.status).to.equal(201);
    }
  });
});
