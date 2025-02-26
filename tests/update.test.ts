const { expect } = require("chai");
const { authCreateToken, logRequest } = require("../src/utils");
const { createBooking } = require("../api/booking/postBooking");
const { updateBooking } = require("../api/booking/updateBooking");
const { deleteBookingById } = require("../api/booking/deleteBookingById");
const { getBookingById } = require("../api/booking/getBookingById.js");
const config = require("../config");

describe("API test for updating a booking", function () {
  let token: string;
  let bookingId: number;

  this.timeout(10000);

  before(async function () {
    // Authorization
    token = await authCreateToken();

    // CreateBooking
    const { bookingId: createdBookingId, response } = await createBooking();
    bookingId = createdBookingId;

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("bookingid");
  });

  it("should update the additional needs field", async function () {
    const updateData = { additionalneeds: "Late checkout" };

    const patchResponse = await updateBooking(bookingId, updateData, token);

    expect(patchResponse.status).to.equal(200);
    expect(patchResponse.body.additionalneeds).to.equal(
      updateData.additionalneeds
    );
  });

  it("should retrieve the updated booking with new additional needs", async function () {
    const getResponse = await getBookingById(bookingId);

    expect(getResponse.status).to.equal(200);
    expect(getResponse.body.additionalneeds).to.equal("Late checkout");
  });
  after(async function () {
    if (bookingId) {
      const deleteResponse = await deleteBookingById(bookingId, token);

      expect(deleteResponse.status).to.equal(201);
    }
  });
});
