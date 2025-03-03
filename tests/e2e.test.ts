import supertest from "supertest";
import { expect } from "chai";
import { authCreateToken, request } from "../src/utils";
import { createBooking } from "../api/booking/postBooking";
import { deleteBookingById } from "../api/booking/deleteBookingById";
import { updateBooking } from "../api/booking/updateBooking";
import { getBookingById } from "../api/booking/getBookingById";
import config from "../config";

describe("API test for creating, updating, and deleting a booking", function () {
  this.timeout(10000);

  let bookingId: number;
  let token: string;
  let generatedData: Record<string, any>;

  before(async function () {
    token = await authCreateToken();
  });

  it("should create a booking successfully", async function () {
    const { bookingId: newBookingId, response } = await createBooking();
    bookingId = newBookingId;

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("bookingid").that.is.a("number");

    generatedData = response.body.booking;
    expect(response.body.booking).to.deep.equal(generatedData);

    const getResponse = await request
      .get(config.endpoints.bookingById.replace("{id}", bookingId.toString()))
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");

    expect(getResponse.status).to.equal(200);
    expect(getResponse.body).to.deep.equal(generatedData);
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

  it("should delete the booking successfully", async function () {
    const deleteResponse = await deleteBookingById(bookingId, token);

    expect(deleteResponse.status).to.equal(201);

    const getResponse = await getBookingById(bookingId);
    expect(getResponse.status).to.equal(404);
  });
});
