AddressCaptcha

A CAPTCHA-like systemthat verifies user familiarity with an address using Google Maps Street View images.


Project Overview: 

AddressCaptcha is a fraud detection project designed to differentiate between legitimate users and scammers based on their familiarity with a billing address.
It generates Google Street View images of places near a given address and asks users to identify locations they recognize.
This approach can be useful in online shopping fraud prevention, where scammers using stolen credit cards may not be familiar with the billing address.


Features: 

1. Fetches nearby places using Google Places API.
2. Displays Google Street View images of those places.
3. Challenges users to identify locations near the entered address.
4. Evaluates answers to verify familiarity with the location.


Project Background: 

I wanted to create a project in fraud detection related to online shopping.
This was inspired by Forter, a fraud prevention company, and my goal was to add value to the world of e-commerce fraud detection.

Thought Proccess: 

Initially, I considered Machine Learning, but It required too much data preparation for a small project.
So I tired to find a way to identify a scammer's behavior and I went through with the following assumption:
In the case of a stolen credit card, a scammer isn't really familiar with the billing address as opposed to someone who actually owns the credit card.
So I needed to think of a way to differentiate between someone who knows an address (legitimate owner) and someone who don't (credit card stealer).

Restrictions:

1. Using data that is accessible wordwide for 99.9% of addresses (so my solution won't work just for limited places around the world).
2. Do it in a way that won't be easily bypassed with the use of AI / data on the address found on the internet.
3. Something that won't be too hard for a regular customer but will be extremly difficult to a scammer in order to not hinder the shopping expirience.   
4. A solution that I would be able to actually create in the span of a few days.

The Final Solution:

1. Generate Street View photos of places near the billing address.
2. Include decoy images from the broader area but not close to the address.
3. Ask users to identify places they recognize.


Tech Stack:

TypeScript & Node.js - Backend development, Express.js - API framework, Google Places API	- Fetching nearby locations, Google Street View API - Generating place images

I chose this stack because I wanted to learn JS and how to develop a server side in general. 


Development Timeline:

Step 1: Implemented main logic in Python (2-3 days).
Step 2: Built a working FastAPI server for testing and expanded the main logic (1-2 day).
Step 3: Rewrote everything in TypeScript & Node.js (6-8 days).


Here is a step by step tutorial on how to install and run the project: 

https://youtu.be/sh8BYv6eatY


Installation Guide:

1. Clone the repository:
   git clone https://github.com/OmerGreental/AddressCaptcha.git
   
   cd AddressCaptcha
   
3. Install dependencies: npm install

4. Create Enviroment Variables file:
   cp .env.example .env

5. Edit the file in the following format:
   
   PORT=5000 //Choose a port to run locally
   
   GOOGLE_API_KEY=your_google_api_key //This project uses googleMaps api so you need to add here an api key in order to make the api calls
   
   NODE_ENV=development

7. Run the server:
   npx ts-node src/index.ts

8. (optional) download the provided: AddressCaptchaClient.html and open it in your browser.


Using the AddressCaptchaClient.html: 

1. In the html document, edit the port in lines 185 & 216 (currently its 5000) with the port that you are runnnig the server on.
2. Type a valid address in english and press Submit Address.
3. After a few seconds you will see 15 photos of places apear in a grid (you can cycle between 3 photos of each place).
4. Check the checkboxes the top left each place that is close (1 km radius) to the entered address.
5. Press Send Answers at the bottom right of the page.
6. You will see true / false based on your answers at the bottom right of the page.


Using Endpoints: 

Examples using port 5000

Getting the place photos array-

POST http://localhost:5000/api/nearby-search

Body: {"address": "Derech Menachem Begin 144, Tel Aviv-Jaffa"}


Providing the answer as 1 / 0 array in the size of 15-

POST http://localhost:5000/api/submit-answer

Body: {"results": "[1,0,0,1,1,0,0,0,0,0,0,1,0,0,0]"}







