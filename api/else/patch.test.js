const supertest = require("supertest");
const chai = require("chai");
const {
  generateBookingData,
  authCreateToken,
  request,
  expect,
  logRequest,
} = require("../../src/utils");
const config = require("../../config");

describe("API test for updating a booking", function () {
  let bookingId;
  let token;

  this.timeout(10000);

  before(async function () {
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

    // Save booking ID
    bookingId = response.body.bookingid;
  });

  it("should update the additional needs field", async function () {
    const updateData = { additionalneeds: "Late checkout" };

    const patchResponse = await request
      .patch(config.endpoints.bookingById.replace("{id}", bookingId))
      .set("Cookie", `token=${token}`)
      .send(updateData)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");

    logRequest(patchResponse);

    expect(patchResponse.status).to.equal(200);
    expect(patchResponse.body.additionalneeds).to.equal(
      updateData.additionalneeds
    );
  });

  it("should retrieve the updated booking with new additional needs", async function () {
    const getResponse = await request
      .get(config.endpoints.bookingById.replace("{id}", bookingId))
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");

    logRequest(getResponse);

    expect(getResponse.status).to.equal(200);
    expect(getResponse.body.additionalneeds).to.equal("Late checkout");
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
