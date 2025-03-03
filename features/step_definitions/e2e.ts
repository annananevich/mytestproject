const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { authCreateToken, request } = require("../../src/utils");
const { createBooking } = require("../../api/booking/postBooking");
const { deleteBookingById } = require("../../api/booking/deleteBookingById");
const { updateBooking } = require("../../api/booking/updateBooking");
const { getBookingById } = require("../../api/booking/getBookingById");
const config = require("../../config");

let token: string;
let bookingId: number;
let generatedData: Record<string, any>;

Given("I have a valid authentication token", async function () {
  token = await authCreateToken();
  expect(token).to.be.a("string");
});

When("I create a new booking", async function () {
  const { bookingId: newBookingId, response } = await createBooking();
  bookingId = newBookingId;

  expect(response.status).to.equal(200);
  expect(response.body).to.have.property("bookingid").that.is.a("number");

  generatedData = response.body.booking;
});

Then("the booking should be created successfully", async function () {
  const getResponse = await getBookingById(bookingId);

  expect(getResponse.status).to.equal(200);
  expect(getResponse.body).to.deep.equal(generatedData);
});

When(
  "I update the booking additional needs to {string}",
  async function (additionalNeeds: string) {
    const updateData = { additionalneeds: additionalNeeds };

    const patchResponse = await updateBooking(bookingId, updateData, token);

    expect(patchResponse.status).to.equal(200);
    expect(patchResponse.body.additionalneeds).to.equal(additionalNeeds);
  }
);

Then("the booking should be updated successfully", async function () {
  const getResponse = await getBookingById(bookingId);

  expect(getResponse.status).to.equal(200);
  expect(getResponse.body.additionalneeds).to.equal("Late checkout");
});

When("I delete the booking", async function () {
  const deleteResponse = await deleteBookingById(bookingId, token);
  expect(deleteResponse.status).to.equal(201);
});

Then("the booking should be deleted successfully", async function () {
  const getResponse = await getBookingById(bookingId);
  expect(getResponse.status).to.equal(404);
});
