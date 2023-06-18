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
const stationSchema = require("../schemas/station/station_schema_json");
validator.addSchema(stationSchema);

const stationSchemaXsd = require("../schemas/station/station_schema_xsd");
const xsdDocument = libxml.parseXmlString(stationSchemaXsd);

//for setting up the id that will be passed in the url
//this is used anytime there is an id found in the url
exports.getStationId = (req, res, next, id) => {
    const sql = 'SELECT * FROM station WHERE station.StationID = $id';
    const values = {$id: id};
    db.get(sql, values, (error, station) => {
        if(error) {
            next(error);
        } else if (station) {
            req.station = station;
            next();
        } else {
            res.sendStatus(404);
        }
    });
};


exports.getStation =  (req, res, next) => {
    db.all("SELECT * FROM station", (error , station) => {
        //in case of any error it goes to the errorHandler middleware
        if(error) {
            next(error)
        } else {
            //requesting in json format
            if(req.get('Content-Type') === 'application/json') {
                res.status(200).json({stations: {station: station}});
            }

            //requesting in xml format
            if(req.get('Content-Type') === 'application/xml') {
                res.send(xml({stations:{station: station}}));
            }
        }
    });

};

exports.getStationById = (req, res) => {
    if(req.get('Content-Type') === 'application/json') {
        res.status(200).json({stations:{station: req.station}});
    }
    if(req.get('Content-Type') === 'application/xml') {
        res.send(xml({stations:{station: req.station}}));
    }
};

exports.postStation = (req, res, next) => {
    //posting in json format
    if(req.get('Content-Type') === 'application/json') {
        //declaring variables used for inserting into the database
        const stationID = req.body.StationID;
        const statusStation = req.body.StatusStation;

        //using try catch to validate
        try{
            validator.validate(req.body, stationSchema, { throwError: true })
        } catch (error) {
            res.status(401).end('Body of json is not valid with schema: ' + error.message);
            return;
        }

        const  sql = 'INSERT INTO station(StationID, StatusStation)' +
            'VALUES($stationID, $statusStation)';

        const values = {
            $stationID: stationID,
            $statusStation: statusStation
        };
        //run the sql command and the values
        db.run(sql, values, (error) =>  {
            if(error) {
                next(error);
            } else {
                res.status(201).json({stations: req.body});
            }
        });
    }

    if(req.get('Content-Type') === 'application/xml') {
        //saving all xml data
        const allXmlData = libxml.parseXmlString(req.body);

        //get each data from the xml to enable me post to the database
        const stationID = allXmlData.get('//StationID');
        const statusStation = allXmlData.get('//StatusStation');


//         //checking if the xml data is valid before inserting
        if(allXmlData.validate(xsdDocument))  {
            const  sql = 'INSERT INTO station(StationID, StatusStation)' +
                'VALUES($stationID, $statusStation)';

            //add text() to the values to filter and get the text only from the xml and save the data in db
            const values = {
                $stationID: stationID.text(),
                $statusStation: statusStation.text()
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

exports.putStation  = (req, res, next) => {
 //updating in json format
    if(req.get('Content-Type') === 'application/json') {
        const statusStation = req.body.StatusStation;

        //using try catch to validate
        try {
            validator.validate(req.body, stationSchema, {throwError: true})
        } catch (error) {
            res.status(401).send('Unable to update and valid with schema: ' + error.message);
            return;
        }

        const sql = `UPDATE station SET StatusStation = $statusStation WHERE station.StationID = ${req.params.id}`;
        const values = {
            $statusStation: statusStation
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
        const statusStation = allXmlData.get('//StatusStation');

        //checking if the xml data is valid before updating
        if(allXmlData.validate(xsdDocument))  {
            const sql = `UPDATE station SET StatusStation = $statusStation WHERE station.StationID = ${req.params.id}`;

            //add text() to the values to filter and updating data in db
            const values = {
                $statusStation: statusStation.text()
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

//delete handler controller
exports.deleteStation =  (req, res, next) => {
    //deleting data in json format
    if(req.get('Content-Type') === 'application/json') {
        const sql = `DELETE FROM station WHERE station.StationID = $id`;
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
        const sql = `DELETE FROM station WHERE station.StationID = $id`;
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

