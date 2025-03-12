Feature: Booking

  Scenario: Creating, updating, and deleting a booking
    Given I have a valid authentication token
    When I create a new booking
    Then the booking should be created successfully

    When I update the booking with the following details:
      | checkin    | checkout   | additionalneeds |
      | <checkin>  | <checkout> | <option>        |
    Then the booking should be updated successfully
    And the booking should have new option "<option>"

    When I delete the booking
    Then the booking should be deleted successfully

    Examples:
    | checkin    | checkout   | option        |
    | 2025-06-05 | 2025-06-12 | Late checkout |
    | 2025-07-01 | 2025-07-10 | Sea view      |
    | 2025-08-15 | 2025-08-20 | Extra bed     |
