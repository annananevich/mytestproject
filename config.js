module.exports = {
  baseUrl: "https://restful-booker.herokuapp.com",
  endpoints: {
    bookings: "/booking",
    bookingById: "/booking/{id}",
    auth: "/auth",
    getBookingIds: "/booking",
    updateBooking: "/booking/{id}",
    deleteBooking: "/booking/{id}",
  },
};
