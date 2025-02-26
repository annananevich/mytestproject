const { request, logRequest } = require("../../src/utils");
const config = require("../../config");

async function getBookingById(bookingId) {
  try {
    const response = await request
      .get(config.endpoints.bookingById.replace("{id}", bookingId.toString()))
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");

    logRequest(response);

    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

module.exports = { getBookingById };
