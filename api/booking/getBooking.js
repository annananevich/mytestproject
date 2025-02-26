const { request, logRequest } = require("../../src/utils");
const config = require("../../config");

async function getBookings() {
  try {
    const response = await request.get(config.endpoints.bookings);
    logRequest(response);
    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

module.exports = { getBookings };
