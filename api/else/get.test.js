const supertest = require("supertest");
const chai = require("chai");
const { request, expect, logRequest } = require("../src/utils");
const config = require("../config");
const { getBookings } = require("../api/booking/getBooking");

describe("API test to get the booking list", function () {
  this.timeout(10000);

  it("Should return the full list of bookings", async () => {
    const response = await getBookings();

    expect(response.status).to.equal(200);
    expect(Array.isArray(response.body)).to.be.true;
    expect(response.body.length).to.be.greaterThan(0);

    response.body.forEach((booking) => {
      expect(booking).to.have.property("bookingid");
    });
  });
});
