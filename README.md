Module: Data processing

## Getting Started

Ensure that you have node installed on your PC before executing the server to test the different endpoints. You can execute the below command in the terminal to know if Node JS is already installed:

`node -v`

If Node.js is already installed on your computer, then you are good to go, otherwise, you can download the Long-Term Support (LTS) version of Node.js from the following site if you don't already have it installed: [https://nodejs.org/en].


## **Summary of the project structure**:

- **testData** This directory contains the data that can use used to test the endpoint for both Json and XML.
- **controller** This directory contains all the functionality for the CRUD operation. For both Json and XML.
- **routes**: This contains the API routes which are used.
- **schemas**: Contains the Json and XML schemas which are used for validation.
- **visualization**: This directory contains the front end which is used for consuming the APIs and visualizing the data.

## Software needed

**Testing the API endpoints**:  Postman or insomnia tool can be used. But preferably Postman link to download https://www.postman.com/downloads/

**Database**: **DB browser for SQLite** should be used. You can load the database using this tool, which can be found in the root of the project as **database.sqlite**. This tool enables you to view the data and tables within the database. However, it is not necessary for testing the endpoints. You can download the DB browser from the following link: https://sqlitebrowser.org/dl/.

## Installation

To install all the required packages, please clone or manually download the project from github using and launch it using any code editor, preferably IntelliJ or Visual Studio Code. Afterwards, open the terminal in IntelliJ and execute the following command:

`npm install`

## How to Run

To run the server execute the following command:

`npm start`

## Endpoints

These are the various endpoints created. All the functionality of CRUD for both JSON and XML are created.

http://localhost:9000/api/carrier

http://localhost:9000/api/operator

http://localhost:9000/api/order

http://localhost:9000/api/station

**The Content-type in the HTTP Headers should be changed to application/json or application/xml** For either json or xml.