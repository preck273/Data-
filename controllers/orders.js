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
const orderSchema = require("../schemas/order/order_schema_json");
validator.addSchema(orderSchema);

const orderSchemaXsd = require("../schemas/order/order_schema_xsd");
const xsdDocument = libxml.parseXmlString(orderSchemaXsd);

//for setting up the id that will be passed in the url
//this is used anytime there is an id found in the url
exports.getOrderId = (req, res, next, id) => {
    const sql = 'SELECT * FROM orders WHERE orders.OrderID = $id';
    const values = {$id: id};
    db.get(sql, values, (error, order) => {
        if(error) {
            next(error);
        } else if (order) {
            req.order = order;
            next();
        } else {
            res.sendStatus(404);
        }
    });
};


exports.getOrder =  (req, res, next) => {
    db.all("SELECT * FROM orders", (error , order) => {
        if(error) {
            next(error)
        } else {
            //requesting in json format
            if(req.get('Content-Type') === 'application/json') {
                res.status(200).json({orders: {order: order}});
            }

            //requesting in xml format
            if(req.get('Content-Type') === 'application/xml') {
                res.send(xml({orders:{order: order}}));
            }
        }
    });

};

exports.getOrderById = (req, res) => {
    if(req.get('Content-Type') === 'application/json') {
        res.status(200).json({orders:{order: req.order}});
    }
    if(req.get('Content-Type') === 'application/xml') {
        res.send(xml({orders:{order: req.order}}));
    }
};

exports.postOrder = (req, res, next) => {
    //posting in json format
    if(req.get('Content-Type') === 'application/json') {
        //declaring variables used for inserting into the database
        const orderID = req.body.OrderID;
        const orderInformation = req.body.OrderInformation;

        //using try catch to validate
        try{
            validator.validate(req.body, orderSchema, { throwError: true })
        } catch (error) {
            res.status(401).end('Body of json is not valid with schema: ' + error.message);
            return;
        }

        const  sql = 'INSERT INTO orders(OrderID, OrderInformation)' +
            'VALUES($orderID, $orderInformation)';

        const values = {
            $orderID: orderID,
            $orderInformation: orderInformation
        };
        //run the sql command and the values
        db.run(sql, values, (error) =>  {
            if(error) {
                next(error);
            } else {
                res.status(201).json({orders: req.body});
            }
        });
    }

    if(req.get('Content-Type') === 'application/xml') {
        //saving all xml data
        const allXmlData = libxml.parseXmlString(req.body);

        //get each data from the xml to enable me post to the database
        const orderID = allXmlData.get('//OrderID');
        const orderInformation = allXmlData.get('//OrderInformation');


    //checking if the xml data is valid before inserting
        if(allXmlData.validate(xsdDocument))  {
            const  sql = 'INSERT INTO orders(OrderID, OrderInformation)' +
                'VALUES($orderID, $orderInformation)';

            //add text() to the values to filter and get the text only from the xml and save the data in db
            const values = {
                $orderID: orderID.text(),
                $orderInformation: orderInformation.text()
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

exports.putOrder = (req, res, next) => {
    //updating in json format
    if(req.get('Content-Type') === 'application/json') {
        const orderInformation = req.body.OrderInformation;

        //using try catch to validate
        try {
            validator.validate(req.body, orderSchema, {throwError: true})
        } catch (error) {
            res.status(401).send('Unable to update and valid with schema: ' + error.message);
            return;
        }

        const sql = `UPDATE orders SET OrderInformation = $orderInformation WHERE orders.OrderID = ${req.params.id}`;
        const values = {
            $orderInformation: orderInformation
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
        const orderInformation = allXmlData.get('//OrderInformation');

        //checking if the xml data is valid before updating
        if(allXmlData.validate(xsdDocument))  {
            const sql = `UPDATE orders SET OrderInformation = $orderInformation WHERE OrderID = ${req.params.id}`;

            //add text() to the values to filter and updating data in db
            const values = {
                $orderInformation: orderInformation.text()
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
exports.deleteOrder =  (req, res, next) => {
    //deleting data in json format
    if(req.get('Content-Type') === 'application/json') {
        const sql = `DELETE FROM orders WHERE orders.OrderID = $id`;
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
        const sql = `DELETE FROM orders WHERE OrderID = $id`;
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

