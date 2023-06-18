const express = require('express');
const stationRouter = express.Router();

const {
    getStation,
    getStationId,
    getStationById,
    postStation,
    putStation,
    deleteStation
} = require('../controllers/station');

//use for setting up the id to perform CRUD
//which will be the id passed in the url
stationRouter.param("id", getStationId);

//GET
stationRouter.get("/", getStation);

//GET by a single resource
stationRouter.get("/:id", getStationById)

//POST
stationRouter.post("/", postStation);

//UPDATE
stationRouter.put("/:id", putStation);

//DELETE
stationRouter.delete("/:id", deleteStation);

module.exports = stationRouter;
