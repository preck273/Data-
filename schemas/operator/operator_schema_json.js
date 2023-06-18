const operatorSchema = {
    "schema": "http://json-schema.org/draft-07/schema#",
    "title": "operatorSchema",
    "type": "object",
    "properties": {
        "operatorID": {
            "type": "integer",
            "description": "the id",
            "minimum": 1
        },
        "Password": {
            "type": "string",
            "description": "password details",
            "minLength": 4
        },
        "Authorization": {
            "type": "string",
            "description": "user rights"
        }
    },
    "required": ["Password", "Authorization"]
};

module.exports = operatorSchema;
