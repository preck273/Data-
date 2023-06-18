const orderSchema = {
    "schema": "http://json-schema.org/draft-07/schema#",
    "title": "orderSchema",
    "type": "object",
    "properties": {
        "OrderID": {
            "type": "integer",
            "description": "the id",
            "minimum": 1
        },
        "OrderInformation": {
            "type": "string",
            "description": "the order information"
        }
    },
    required: ["OrderInformation"]
};

module.exports = orderSchema;
