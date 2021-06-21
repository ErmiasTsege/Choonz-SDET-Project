Feature: choonz Site

  Scenario: User singup
    Given the user is on the Landing page    
    When the user clicked logout button
    And the user try to sing up with username Marta8,pasword Matios1234 and confirmation password Matios1234
    Then the user is singed up
Scenario: User sing in
    Given the user is on the Login page
    When the user try to sing in with username Marta8 and password Matios1234
    Then the user is signined in
  #Scenario Outline: Purchase items and verify the purchase
    #Given the user ermineger@gmail.com with the password el44lb is logged in
    #When the user adds the following items to the cart
#			| Printed Dress	|
#			| Blouse|
    #When the user checks out the items
    #Then the purchase is verified via a confirmation page
