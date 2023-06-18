Module: Data processing

Student: Precious 

## Getting Started

Ensure that you have node installed on your PC before executing the server to test the different endpoints. You can type this in the terminal to know if Node JS is already installed:

`node -v`

If there is a version present there is Node JS on your PC. If not download the LTS version from this link: https://nodejs.org/en.


## **Summary of the project structure**:

- **testData** This directory contains the data that can use used to test the endpoint for both Json and XML.
- **controller** This directory contains all the functionality for the CRUD operation. For both Json and XML.
- **routes**: This contains the API routes which are used.
- **schemas**: Contains the Json and XML schemas which are used for validation.
- **visualization**: This directory contains the front end which is used for consuming the APIs and visualizing the data.

## Software needed

**Testing the API endpoints**:  Postman or insomnia tool can be used. But preferably Postman link to download https://www.postman.com/downloads/

**Database**: **DB browser for SQLite** can be you used. You can load the database using this tool, which can be found in the root of the project as **database.sqlite**. This can be used to view the data and tables but its not needed to test the endpoints. Link to download https://sqlitebrowser.org/dl/

## Installation 

After you clone the project or download the project manually using any code editor preferably IntelliJ or Visual studio code

To install all the packages needed do this:

`npm install`

## How to Run

To run the server do this:

`npm start`

## Endpoints

These are the various endpoints created. All the functionality of CRUD for both JSON and XML are created.

http://localhost:9000/api/carrier

http://localhost:9000/api/operator

http://localhost:9000/api/order

http://localhost:9000/api/station

**The Content-type in the HTTP Headers should be changed to application/json or application/xml** For either json or xml.
