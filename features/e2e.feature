Feature: Booking E2E

  Scenario: Creating, updating, and deleting a booking
    Given I have a valid authentication token
    When I create a new booking
    Then the booking should be created successfully

    When I update the booking additional needs to "Late checkout"
    Then the booking should be updated successfully

    When I delete the booking
    Then the booking should be deleted successfully
