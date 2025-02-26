const supertest = import("supertest");
const chai = import("chai");
const { generateBookingData, authCreateToken, request, expect, logRequest } =
  import("../../src/utils");
const config = import("../../config");

describe("API test for deleting a booking", function () {
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

  it("should delete a booking by ID", async function () {
    const deleteResponse = await request
      .delete(config.endpoints.deleteBooking.replace("{id}", bookingId))
      .set("Cookie", `token=${token}`);

    logRequest(deleteResponse);

    expect(deleteResponse.status).to.equal(201);
  });

  it("should return 404 when retrieving the deleted booking", async function () {
    const getResponse = await request.get(
      config.endpoints.bookingById.replace("{id}", bookingId)
    );

    logRequest(getResponse);

    expect(getResponse.status).to.equal(404);
  });
});
