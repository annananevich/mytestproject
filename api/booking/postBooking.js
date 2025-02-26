const { request, logRequest, generateBookingData } = require("../../src/utils");
const config = require("../../config");

async function createBooking() {
  try {
    // Data Generation
    const data = generateBookingData();

    // Create Booking
    const response = await request
      .post(config.endpoints.bookings)
      .send(data)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");

    logRequest(response);

    // Checking the response status
    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    // // Checking ID
    if (!response.body.bookingid) {
      throw new Error("Booking ID is missing in response");
    }

    return {
      bookingId: response.body.bookingid,
      response,
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

module.exports = { createBooking };
