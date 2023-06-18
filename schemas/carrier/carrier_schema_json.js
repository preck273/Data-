const carrierSchema = {
    "schema": "http://json-schema.org/draft-07/schema#",
    "title": "carrierSchema",
    "type": "object",
    "properties": {
        "tagID": {
            "type": "integer",
            "description": "the id",
            "minimum": 1
        },
        "OrderID_O": {
            "type": "integer",
            "description": "The order id",
            "minimum": 1
        },
        "StationID": {
            "type": "integer",
            "description": "The station id",
            "minimum": 1
        },
        "StatusCarrier": {
            "type": "string",
            "description": "status of the carrier"
        }
    },
    "required": ["OrderID_O", "StationID", "StatusCarrier"]
};

module.exports = carrierSchema;
