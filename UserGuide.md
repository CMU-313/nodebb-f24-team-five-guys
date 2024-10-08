# Five Guys' Guide for User Stories

## Table of Contents

[User Story 7](#user-story-7)

[User Story 10](#user-story-10)

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



## User Story 10

As a user, I want to see the most popular users across all users in the ‘users’ page, so that I can have a better idea of who has most followers on Nodebb

### How to Use User Story 10
* Users page
   * To view the users with the most followers, click on the ‘Most Followers’ tab in the users page and it will display the users with the most followers in descending order, similar to how it is done with ‘Most Reputation’ or ‘Top Posters’.

### How to User Test User Story 10
* Users Page: 
    1. Follow a random user or another account you have created on their user profile page
    2. Follow User: When you navigate to the users page, you will see the changes reflected whereby the random user will appear before you in the “Most Followers” display, with their follow count of 1 reflected and yours 0.
    3. Unfollow User: When you unfollow the same user, you will then see their follower count of 0 displayed below

### Automated Tests - located in *test/controllers.js*

#### Error Tests: test whether users are sorted based on number of followers at all times
* Test that users are sorted based on number of followers: Lines 121 - 163
    1. 130 - 135: Created 6 users
    2. 139 - 143: Made user 1 the most followed user
    3. 145 - 148: Made user 6 the second most followed user
    4. 150 - 152: Made user 3 the third most followed user
    5. 159 - 161: Checked that the array of users is sorted based on the most followed
* Updated sorted order when users unfollow: Lines 165 - 180
    1. 168 - 170: Verify current order of users is sorted
    2. 173 - 174: Make users unfollow user 1 so it is no longer the most followed
    3. 179 - 180: Verify that user 6 is now the most followed and user1 is second most followed

#### Valid Tests

Testing **whether the users were sorted based on the number of followers that they had** meant creating users and creating an order for which users were the most followed. Then we got the array of users returned by the api route that should sort users and verified that the array was indeed sorted based on which users were the most followed (based on the order that we created).

We also made users **unfollow the most followed user** and checked whether the api returned a new array of users where the second most followed user was now the most followed user. 

#### Test Conclusion
We believe that these tests are sufficient for covering the changes that we have made as we created an expected order for the users who are the most followed and the result returned from the api route indeed did match our expected order. To verify that this order of users is correct at all times, we made users unfollow the most followed user and updated our expected order of users. We then verified that the api route did return our new expected order of users again. 
