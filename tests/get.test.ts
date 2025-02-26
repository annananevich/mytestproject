const supertest = require("supertest");
const { expect } = require("chai");
const { request, logRequest } = require("../src/utils.js");
const config = require("../config.js");
const { getBookings } = require("../api/booking/getBooking.js");

describe("/api test to get the booking list", function () {
  this.timeout(10000);

  it("should return the full list of bookings", async () => {
    const response = await getBookings();

    expect(response.status).to.equal(200);
    expect(Array.isArray(response.body)).to.be.true;
    expect(response.body.length).to.be.greaterThan(0);

    // Check that each item in the array has the property 'bookingid'
    response.body.forEach((booking: any) => {
      expect(booking).to.have.property("bookingid");
    });
    logRequest(response);
  });
});
