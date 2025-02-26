const supertest = require("supertest");
const chai = require("chai");
const { faker } = require("@faker-js/faker");
const config = require("../config");

const request = supertest(config.baseUrl);
const expect = chai.expect;

function generateBookingData() {
  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 500 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: "2025-06-01",
      checkout: "2025-06-10",
    },
    additionalneeds: faker.helpers.arrayElement([
      "Breakfast",
      "Lunch",
      "Dinner",
      "None",
    ]),
  };
}

async function authCreateToken() {
  const response = await request
    .post(config.endpoints.auth)
    .set("Content-Type", "application/json")
    .send({
      username: "admin",
      password: "password123",
    });

  console.log("Auth Response:", JSON.stringify(response.body));

  expect(response.status).to.equal(200);
  expect(response.body).to.have.property("token");

  return response.body.token;
}

function logRequest(response) {
  console.log("Request URL:", response.request.url);
  console.log("Request Method:", response.request.method);
  console.log("Request Body:", JSON.stringify(response.request._data, null, 2));
  console.log("Response Status:", response.status);
  console.log("Response Body:", JSON.stringify(response.body, null, 2));
}

module.exports = {
  generateBookingData,
  authCreateToken,
  request,
  expect,
  logRequest,
};
