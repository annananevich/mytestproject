const { request, logRequest } = require("../../src/utils");
const config = require("../../config");

async function updateBooking(bookingId, updateData, token) {
  try {
    const patchResponse = await request
      .patch(config.endpoints.bookingById.replace("{id}", bookingId.toString()))
      .set("Cookie", `token=${token}`)
      .send(updateData)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");

    logRequest(patchResponse);

    if (patchResponse.status !== 200) {
      throw new Error("Error updating booking");
    }

    return patchResponse;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
}

module.exports = { updateBooking };
