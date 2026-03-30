

## `





## Project Go Ceylon

We are building a web application called GoCeylon.
GoCeylon is a community-based tourism platform that connects tourists directly with
local service providers. The main idea is to help tourists discover authentic experiences,
activities, and events offered by local people, instead of only visiting the usual tourist
destinations.
For example, a tourist can use the platform to find:
- a village cooking experience
- a local surfing instructor
- a traditional dance event
- a cultural craft workshop
- scenic places and nearby activities through a map
At the same time, local people such as villagers, artists, and small-scale providers can
create accounts and offer their services through the platform.
So, this system acts as a digital bridge between tourists and local communities.


Why are we building this project?
We are building this project because Sri Lankan tourism is mostly concentrated in a few
major places. Because of that:
- many rural communities do not benefit much from tourism
- local providers do not have a proper digital platform to promote their services
- tourists cannot easily discover authentic local experiences
- there is no centralized and structured system for booking these activities securely
GoCeylon solves this by giving local communities visibility and giving tourists a secure
platform to discover and book experiences.

What are the main functions of this project?
The main functions of the project are:
- user registration and secure login
- provider account management
- activity and event listing creation
- interactive map-based discovery
- real-time booking and reservation
- secure online payment
- reviews and ratings

## `





- admin moderation and analytics
In simple words, the system allows:
- providers to publish activities
- tourists to discover and book them
- the platform to manage payments, trust, and quality


Functions of each member

## Member 1 – User Management & Authentication System
This member handles the user account system.
Main functions:
- register tourist accounts
- register provider accounts
- log in and log out users
- manage user profiles
- verify provider credentials
- manage account settings
- apply role-based access control
## Purpose:
This feature makes sure that different users can securely access the system according to
their role.

## Member 2 – Activity & Event Listing Management
This member handles the service and event creation part.
Main functions:
- create activity listings
- create event listings
- upload images and descriptions
- set pricing
- manage availability
- categorize activities
- edit and delete listings
## Purpose:
This feature allows service providers to publish and manage what they offer to tourists.

Member 3 – Interactive Location-Based Activity Discovery Map
This member handles the map and discovery experience.
Main functions:

## `





- show activities on an interactive map
- detect the user’s current location
- filter activities by distance
- filter activities by category
- show nearby scenic locations and events
- save favorite places
- save favorite activities
- create travel itineraries
- save user search preferences
## Purpose:
This feature helps tourists discover activities visually and based on location, making the
platform more interactive and useful.

## Member 4 – Booking & Reservation System
This member handles the booking process.
Main functions:
- select date and time slots
- check real-time availability
- create booking records
- confirm reservations
- generate booking reference numbers
- send booking notifications
- display booking history
- cancel bookings
## Purpose:
This feature allows tourists to reserve activities in a structured and reliable way.

## Member 5 – Payment Processing & Financial Management
This member handles the payment side of the system.
Main functions:
- process secure online payments
- verify payment status
- calculate platform commission
- generate invoices and receipts
- manage provider payouts
- show transaction history
- update payment records
## Purpose:
This feature ensures that the booking process is financially secure and transparent.

## `






## Member 6 – Review System & Admin Panel
This member handles trust, moderation, and platform management.
Main functions:
- allow tourists to submit ratings and reviews
- show reviews and average ratings
- generate personalized recommendations
- moderate reviews and content
- manage users and providers
- handle disputes
- view analytics and reports
- remove inappropriate content
## Purpose:
This feature helps maintain trust, quality, and overall control of the platform.

Simple summary
## Project:
A tourism marketplace platform for authentic local experiences
Main goal:
Connect tourists with local communities through a secure digital ecosystem
Core system flow:
- users register
- providers add activities
- tourists discover them on the map
- tourists book and pay
- tourists leave reviews
- admins manage quality and safety


## `








## Registration
## Number
(Same order
as above)
Name of Feature/s Brief description of feature(s) in point form
## 01
IT24103772 User Management &
## Authentication System
- Register tourist and provider
accounts
- Login/logout with secure
authentication
- Create and update user profiles
- Verify provider credentials
## 02
IT24103420 Activity & Event Listing
## Management System
- Create activity and event listings
- Upload photos and descriptions
- Set pricing and availability
- Categorize activities (cultural,
adventure, culinary, etc.)
## 03
IT24103524 Interactive Location-Based
## Activity Discovery Map
- Display activities on interactive map
- Detect user's current location
- Filter activities by distance and
category
- Show nearby scenic locations and
events

## 04
IT24103207 Booking & Reservation
## System
- Select date and time slots
- Check real-time availability
- Confirm bookings with reference
numbers
- Send booking notifications
## 05
IT24103022 Payment Processing &
## Financial Management
- Process secure online payments
- Calculate platform commission
- Generate invoices and receipts
- Manage provider payouts
## 06
IT24103280 Review System & Admin
## Panel
- Submit ratings and reviews
- Generate personalized
recommendations
- Moderate user content and listings
- View platform analytics

## `





CRUD Operations for Each Member –
GoCeylon
## Member 1 – User Management & Authentication System
## Create
- Register tourist account
- Register service provider account
- Create provider verification request
## Read
- View user profile details
- Retrieve user account information during login
- View account settings
- View provider verification status
## Update
- Update user profile information
- Update password
- Update account settings
- Update provider verification details
## Delete
- Deactivate user account
- Remove invalid or duplicate account records

## Member 2 – Activity & Event Listing Management System
## Create
- Create new activity listing
- Create new event listing
- Upload activity or event images
- Add pricing and availability details

## `





## Read
- View all activities and events
- View activity details
- View event details
- View provider’s own listings
## Update
- Edit activity details
- Edit event details
- Update pricing
- Update availability
- Update activity category
## Delete
- Delete activity listing
- Delete event listing
- Remove uploaded images from listings

Member 3 – Interactive Location-Based Activity Discovery
## Map
## Create
- Save favorite locations
- Save favorite activities
- Create travel itinerary
- Save personalized search preferences
## Read
- View nearby activities on map
- View nearby events on map
- View scenic locations
- View saved locations
- View saved activities
- View itinerary details
- View filtered activities by distance and category

## `





- View personalized recommendations based on location
## Update
- Update saved search preferences
- Edit travel itinerary
- Update selected map filters
- Modify saved locations list
## Delete
- Remove saved locations
- Remove favorite activities
- Delete travel itinerary
- Clear saved search preferences

## Member 4 – Booking & Reservation System
## Create
- Create booking record
- Generate booking reference number
- Create reservation entry for selected slot
## Read
- View booking history
- View booking details
- View reservation status
- View provider-side booking requests
## Update
- Update booking status
- Confirm booking
- Cancel booking
- Update reservation details if needed
## Delete
- Delete cancelled booking record

## `





- Remove expired reservation entries

## Member 5 – Payment Processing & Financial Management
## Create
- Create payment transaction
- Generate invoice
- Generate receipt
- Create payout record for provider
## Read
- View payment history
- View invoice details
- View receipt details
- View provider payout history
- View transaction logs
## Update
- Update payment status
- Update payout status
- Update commission calculation record
- Mark invoice as paid
## Delete
- Remove invalid transaction records
- Delete failed payment logs if required by admin policy

## Member 6 – Review System & Admin Panel
## Create
- Submit review
- Add rating
- Create admin moderation action record

## `





- Create recommendation record
## Read
- View reviews
- View ratings
- View analytics dashboard
- View reports
- View user activity logs
- View flagged content
## Update
- Edit review
- Update recommendation data
- Update user status
- Update provider approval status
- Update moderation decisions
## Delete
- Delete inappropriate reviews
- Remove flagged activities
- Remove inappropriate user-generated content
- Delete suspended or banned user records





