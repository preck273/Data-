//Used for returning the data in xml
const xml = require("object-to-xml");

//for validating json schema
const jsonValidator = require('jsonschema').Validator;
const validator = new jsonValidator();

//for validating xml schema
const libxml = require('libxmljs2');

//sqlite instance
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

//importing the carrier schemas and used for validation
const carrierSchema = require("../schemas/carrier/carrier_schema_json");
validator.addSchema(carrierSchema);

const carrierSchemaXsd = require("../schemas/carrier/carrier_schema_xsd");
const xsdDocument = libxml.parseXmlString(carrierSchemaXsd);

//for setting up the id that will be passed in the url
//this is used anytime there is an id found in the url
exports.getCarrierId = (req, res, next, id) => {
    const sql = 'SELECT * FROM carrier WHERE carrier.tagID = $id';
    const values = {$id: id};
    db.get(sql, values, (error, carrier) => {
        if(error) {
            next(error);
        } else if (carrier) {
            req.carrier = carrier;
            next();
        } else {
            res.sendStatus(404);
        }
    });
};


exports.getCarrier =  (req, res, next) => {
    db.all("SELECT * FROM carrier", (error , carrier) => {
        //in case of any error it goes to the errorHandler middleware
        if(error) {
            next(error)
        } else {
            //requesting in json format
            if(req.get('Content-Type') === 'application/json') {
                res.status(200).json({carriers: {carrier: carrier}});
            }

            //requesting in xml format
            if(req.get('Content-Type') === 'application/xml') {
                res.send(xml({carriers:{carrier: carrier}}));
            }
        }
    });

};

exports.getCarrierById = (req, res) => {
    if(req.get('Content-Type') === 'application/json') {
        res.status(200).json({carriers:{carrier: req.carrier}});
    }
    if(req.get('Content-Type') === 'application/xml') {
        res.send(xml({carriers:{carrier: req.carrier}}));
    }
};

exports.postCarrier = (req, res, next) => {
 //posting in json format
    if(req.get('Content-Type') === 'application/json') {
        //declaring variables, this use for inserting into the database
        const tagID = req.body.tagID;
        const orderID_O = req.body.OrderID_O;
        const stationID = req.body.StationID;
        const statusCarrier = req.body.StatusCarrier;


        //using try catch to validate
        try{
            validator.validate(req.body, carrierSchema, { throwError: true })
        } catch (error) {
            res.status(401).end('Body of json is not valid with schema: ' + error.message);
            return;
        }

        const  sql = 'INSERT INTO carrier(tagID, OrderID_O, StationID, StatusCarrier)' +
            'VALUES($tagID, $orderID_O, $stationID, $statusCarrier)';

        const values = {
            $tagID: tagID,
            $orderID_O: orderID_O,
            $stationID: stationID,
            $statusCarrier: statusCarrier
        };
        //this run the sql command and their values
        db.run(sql, values, (error) =>  {
            if(error) {
                next(error);
            } else {
                res.status(201).json({carriers: req.body});
            }
        });
    }

    if(req.get('Content-Type') === 'application/xml') {
        //saving all xml data
        const allXmlData = libxml.parseXmlString(req.body);

        //get each data from the xml to enable me post to the database
        const tagID = allXmlData.get('//tagID');
        const orderID_O = allXmlData.get('//OrderID_O');
        const stationID = allXmlData.get('//StationID');
        const statusCarrier = allXmlData.get('//StatusCarrier');

        //checking if the xml data is valid before inserting
        if(allXmlData.validate(xsdDocument))  {
            const  sql = 'INSERT INTO carrier(tagID, OrderID_O, StationID, StatusCarrier)' +
            'VALUES($tagID, $orderID_O, $stationID, $statusCarrier)';

            //add text() to the values to filter and get the text only from the xml and save the data in db
            const values = {
                $tagID: tagID.text(),
                $orderID_O: orderID_O.text(),
                $stationID: stationID.text(),
                $statusCarrier: statusCarrier.text()
            };
            //run the sql command and the values
            db.run(sql, values, (error) =>  {
                if(error) {
                    next(error);
                } else {
                    res.status(201).send(req.body);
                }
            });
        }  else {
            res.status(401).send('One or more tags missing \n And check if each tags have the right data types');
        }
    }
};

 exports.putCarrier = (req, res, next) => {
     //updating in json format
    if(req.get('Content-Type') === 'application/json') {
        const orderID_O = req.body.OrderID_O;
        const stationID = req.body.StationID;
        const statusCarrier = req.body.StatusCarrier;

        //using try catch to validate
        try {
            validator.validate(req.body, carrierSchema, {throwError: true})
        } catch (error) {
            res.status(401).send('Unable to update and valid with schema: ' + error.message);
            return;
        }

        const sql = `UPDATE carrier SET OrderID_O = $orderID_O, StationID = $stationID, StatusCarrier = $statusCarrier WHERE carrier.tagID = ${req.params.id}`;
        const values = {
            $orderID_O: orderID_O,
            $stationID: stationID,
            $statusCarrier: statusCarrier
        };

        db.run(sql, values, (error) => {
            if (error) {
                next(error);
            } else {
                res.status(201).json(req.body);
            }
        });
    }

     //updating in xml format
    if(req.get('Content-Type') === 'application/xml') {
        const allXmlData = libxml.parseXmlString(req.body);

        //get each data from the xml to enable me post to the database
        const orderID_O = allXmlData.get('//OrderID_O');
        const stationID = allXmlData.get('//StationID');
        const statusCarrier = allXmlData.get('//StatusCarrier');

        //checking if the xml data is valid before updating
        if(allXmlData.validate(xsdDocument))  {
            const sql = `UPDATE carrier SET OrderID_O = $orderID_O, StationID = $stationID, StatusCarrier = $statusCarrier  WHERE tagID = ${req.params.id}`;

            //add text() to the values to filter and updating data in db
            const values = {
                $orderID_O: orderID_O.text(),
                $stationID: stationID.text(),
                $statusCarrier: statusCarrier.text()
            };
            db.run(sql, values, (error) => {
                if (error) {
                    next(error);
                } else {
                    res.status(201).send(req.body);
                }
            });

        }  else {
            res.status(401).send('One or more tags missing \n And check if each tags have the right data types');
        }
    }
 };

exports.deleteCarrier =  (req, res, next) => {
    //deleting data in json format
    if(req.get('Content-Type') === 'application/json') {
        const sql = `DELETE FROM carrier WHERE carrier.tagID = $id`;
        const values = {$id: req.params.id};

        db.run(sql, values, (error) => {
            if(error) {
                next(error);
            } else {
                res.status(200).send("Deleted successfully");
            }
        });
    }

    //deleting data in xml format
    if(req.get('Content-Type') === 'application/xml') {
        const sql = `DELETE FROM carrier WHERE tagID = $id`;
        //get the id to be deleted from the database
        const values = {$id: req.params.id};

        db.run(sql, values, (error) => {
            if(error) {
                next(error);
            } else {
                res.status(200).send("Deleted successfully");
            }
        });
    }
};

