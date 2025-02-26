const { expect } = require("chai");
const { authCreateToken, request, logRequest } = require("../src/utils");
const config = require("../config");
const { createBooking } = require("../api/booking/postBooking.js");
const { getBookingById } = require("../api/booking/getBookingById.js");
const { deleteBookingById } = require("../api/booking/deleteBookingById.js");

describe("API test for deleting a booking", function () {
  let token: string;
  let bookingId: number;

  this.timeout(10000);

  before(async function () {
    token = await authCreateToken();

    //Create Booking and Save BookingID
    const { bookingId: createdBookingId } = await createBooking();
    bookingId = createdBookingId;
  });

  it("should delete a booking by ID", async function () {
    const deleteResponse = await deleteBookingById(bookingId, token);

    expect(deleteResponse.status).to.equal(201);
  });

  it("should return 404 when retrieving the deleted booking", async function () {
    const getResponse = await getBookingById(bookingId);

    expect(getResponse.status).to.equal(404);
  });
});
