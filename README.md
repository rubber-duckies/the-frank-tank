# To-Do Checklist

## General
- [ ] ESLint - AirBnB

## Front End
- [ ] Basic HTML
- [ ] Video Player

## Back End
- [ ] Map server endpoints
- [ ] Map database structure

----
# Development Map

1. Stage 1:
  * Watch random stream of stored videos
  * Play main channel
  * See time-based liked moments w/ emoji

2. Stage 2
  * Account-based login
  * User access to:
    * channel functionality
    * ignore functionality

3. Stage 3
  * Mixtape functionality
  * Gamify - create channels to user with most likes (>20)

----
# Basic Requirements (MVP):

1. Play video
  * client

2. Apply filters
  * server
  * HD standard
  * Most viewed
  * Time limit?
  * add "extreme" to search

3. Create channels
  * client, server
  * restrict channels
    * elements
      * land:
        * mountain biking
        * motorcross
        * skateboarding
        * stunt biking
        * snowboarding
        * skiing
      * sea
        * surfing
        * jet ski
        * wakeboarding
        * water skiing
      * air
        * skydiving
        * base jumping
        * bungee jumping
        * wingsuit
  * database schema

4. Time-based likes
  * client, server
  * get current timestamp from user on toggle on
  * get current timestamp from user on toggle off
  * pause player
  * display modal for tagging
  * grab current user information
  * on modal accept, send information to database
  * resume player
  * cross-user functionality
    * user should have the option to like other user's time-based likes


----
# Extra Credit (non-MVP):

1. Skins
  * change based on element

2. Ignore video
  * by user

3. Gamify - unlock the ability to create channels based on "time-based likes" count
