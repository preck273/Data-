//for returning the data in xml
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
const operatorSchema = require("../schemas/operator/operator_schema_json");
validator.addSchema(operatorSchema);

const operatorSchemaXsd = require("../schemas/operator/operator_schema_xsd");
const xsdDocument = libxml.parseXmlString(operatorSchemaXsd);

//for setting up the id that will be passed in the url
//this is used anytime there is an id found in the url
exports.getOperatorId = (req, res, next, id) => {
    const sql = 'SELECT * FROM operator WHERE operator.operatorID = $id';
    const values = {$id: id};
    db.get(sql, values, (error, operator) => {
        if(error) {
            next(error);
        } else if (operator) {
            req.operator = operator;
            next();
        } else {
            res.sendStatus(404);
        }
    });
};


exports.getOperator =  (req, res, next) => {
    db.all("SELECT * FROM operator", (error , operator) => {
        //in case of any error it goes to the errorHandler middleware
        if(error) {
            next(error)
        } else {
            //requesting in json format
            if(req.get('Content-Type') === 'application/json') {
                res.status(200).json({operators: {operator: operator}});
            }

            //requesting in xml format
            if(req.get('Content-Type') === 'application/xml') {
                res.send(xml({operators:{operator: operator}}));
            }
        }
    });

};

exports.getOperatorById = (req, res) => {
    if(req.get('Content-Type') === 'application/json') {
        res.status(200).json({operators:{operator: req.operator}});
    }
    if(req.get('Content-Type') === 'application/xml') {
        res.send(xml({operators:{operator: req.operator}}));
    }
};

exports.postOperator = (req, res, next) => {
    //posting in json format
    if(req.get('Content-Type') === 'application/json') {
        //declaring variables used for inserting into the database
        const operatorID = req.body.operatorID;
        const password = req.body.Password;
        const authorization = req.body.Authorization;

        //using try catch to validate
        try{
            validator.validate(req.body, operatorSchema, { throwError: true })
        } catch (error) {
            res.status(401).end('Body of json is not valid with schema: ' + error.message);
            return;
        }

        const  sql = 'INSERT INTO operator(operatorID, Password, Authorization)' +
            'VALUES($operatorID, $password, $authorization)';

        const values = {
           $operatorID: operatorID,
           $password: password,
           $authorization: authorization
        };
        //run the sql command and the values
        db.run(sql, values, (error) =>  {
            if(error) {
                next(error);
            } else {
                res.status(201).json({operators: req.body});
            }
        });
    }

    if(req.get('Content-Type') === 'application/xml') {
        //saving all xml data
        const allXmlData = libxml.parseXmlString(req.body);

        //get each data from the xml to enable me post to the database
        const operatorID = allXmlData.get('//operatorID');
        const password = allXmlData.get('//Password');
        const authorization = allXmlData.get('//Authorization');

     //checking if the xml data is valid before inserting
        if(allXmlData.validate(xsdDocument))  {
            const  sql = 'INSERT INTO operator(operatorID, Password, Authorization)' +
                'VALUES($operatorID, $password, $authorization)';

            //add text() to the values to filter and get the text only from the xml and save the data in db
            const values = {
                $operatorID: operatorID.text(),
                $password: password.text(),
                $authorization: authorization.text()
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

exports.putOperator = (req, res, next) => {
    //json format
    if(req.get('Content-Type') === 'application/json') {
        const operatorID = req.body.operatorID;
        const password = req.body.Password;
        const authorization = req.body.Authorization;


        //using try catch to validate
        try {
            validator.validate(req.body, operatorSchema, {throwError: true})
        } catch (error) {
            res.status(401).send('Unable to update and valid with schema: ' + error.message);
            return;
        }

        const sql = `UPDATE operator SET Password = $password, Authorization = $authorization WHERE operator.operatorID = ${req.params.id}`;
        const values = {
            $operatorID: operatorID,
            $password: password,
            $authorization: authorization
        };

        db.run(sql, values, (error) => {
            if (error) {
                next(error);
            } else {
                res.status(201).json(req.body);
            }
        });
    }

    //xml format
    if(req.get('Content-Type') === 'application/xml') {
        const allXmlData = libxml.parseXmlString(req.body);

        //get each data from the xml to enable me post to the database
        const password = allXmlData.get('//Password');
        const authorization = allXmlData.get('//Authorization');

        //checking if the xml data is valid before updating
        if(allXmlData.validate(xsdDocument))  {
            const sql = `UPDATE operator SET Password = $password, Authorization = $authorization  WHERE operatorID = ${req.params.id}`;

            //add text() to the values to filter and updating data in db
            const values = {
                $password: password.text(),
                $authorization: authorization.text()
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
exports.deleteOperator =  (req, res, next) => {
    //deleting data in json format
    if(req.get('Content-Type') === 'application/json') {
        const sql = `DELETE FROM operator WHERE operator.operatorID = $id`;
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
        const sql = `DELETE FROM operator WHERE operatorID = $id`;
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

