# Five Guys' Guide for User Stories

## Table of Contents

[User Story 7](#user-story-7)



## User Story 7

As a user, I want to see everyone’s full names, so that I know who I’m talking to on NodeBB as a username does not give much information about who this person is.

### How To Use User Story 7
* Registration Page
    * To register an account, enter a valid full name in the input box when creating a new account.
* Edit Profile Page
    * To update your full name, replace your current full name with your new full name.
    
**Note that a valid full name does not only contain spaces, is not a valid URL, and does not have a length of over 255 characters. The full name input box should not be blank either.**

### How To User Test User Story 7
* Registration Page: Inputs into Full Name Input Box
    1. Nothing: The user will see an error message “Full Name is Required” when they try to register without anything entered in the full name input box, even if they typed in a proper username and password.
    2. All Spaces: The user will see an error message “Invalid Fullname” when they try to register with only spaces entered in the full name input box, even if they typed in a proper username and password.
    3. Valid URL: The user will see an error message “Invalid Fullname” when they try to register with a valid URL entered in the full name input box, even if they typed in a proper username and password.
    4. Length Exceeds 255 Characters: The user will see an error message “Invalid Fullname” when they try to register with a string of length over 255 characters entered in the full name input box, even if they typed in a proper username and password.
    5. Valid Full Name: The user will be brought to the next page which asks for additional information before officially creating your account.
* Edit Profile Page:
    1. Nothing: The user will see an error message “Full Name is Required” when they try to edit the profile when nothing is entered in the full name input box.
    2. All Spaces: The user will see an error message “Invalid Fullname” when they try to edit the profile when only spaces entered in the full name input box.
    3. Valid URL: The user will see an error message “Invalid Fullname” when they try to edit the profile when a valid URL is entered in the full name input box.
    4. Length Exceeds 255 Characters: The user will see an error message “Invalid Fullname” when they try to edit the profile when a string of length over 255 characters is entered in the full name input box.
    5. Valid Full Name: The user will see a box in the bottom right corner of the page that says, “Success: Profile has been updated successfully!”. Upon refreshing the page, the full name should be updated.

### Automated Tests - located in *test/user.js*

#### Error Tests: test invalid inputs and result in errors
* Full Name for Registration: Lines 1843 - 1891
    1. 1843 - 1852: no input for full name
    2. 1855 - 1865: input of only spaces
    3. 1868 - 1878: input of a valid URL
    4. 1881 - 1891: input of a string with length over 255 characters
* Updated Full Name for Edit Profile: Lines 770 - 805
    1. 771 - 778: no input for full name (i.e. empty string)
    2. 780 - 787: input of only spaces
    3. 789 - 796: input of a string with length over 255 characters
    4. 798 - 805: input of a valid URL

#### Valid Tests
Testing a **valid full name entered on the registration page** meant adding a full name parameter to an existing test case in test/user.js that tested if one can register successfully with valid inputs to username and password. This test case is located in lines **1807-1820**.

It is also unnecessary to test a **valid full name entered on the edit profile page** since this was already an existing feature of NodeBB before implementing User Story 7.

#### Test Conclusion
We believe that these tests are sufficient for covering the changes that we have made because they cover all possible inputs to a full name input box, ensuring that both full names violating constraints and valid full names are tested.