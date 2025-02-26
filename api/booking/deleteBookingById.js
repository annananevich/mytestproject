const { request, logRequest } = require("../../src/utils");
const config = require("../../config");

async function deleteBookingById(bookingId, token) {
  try {
    const response = await request
      .delete(
        config.endpoints.deleteBooking.replace("{id}", bookingId.toString())
      )
      .set("Cookie", `token=${token}`);

    logRequest(response);

    // Checking the response status
    if (response.status !== 201) {
      throw new Error(
        `Failed to delete booking with ID ${bookingId}. Status: ${response.status}`
      );
    }

    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

module.exports = { deleteBookingById };
