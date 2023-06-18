const stationSchema = {
    "schema": "http://json-schema.org/draft-07/schema#",
    "title": "stationSchema",
    "type": "object",
    "properties": {
        "StationID": {
            "type": "integer",
            "description": "the id",
            "minimum": 1
        },
        "StatusStation": {
            "type": "string",
            "enum": ["Offline", "Online"],
            "description": "If the station is online or offline"
        }
    },
    "required": ["StatusStation"]
};

module.exports = stationSchema;
