const express = require('express');
const carrierRouter = express.Router();

const {
    getCarrier,
    getCarrierId,
    getCarrierById,
    postCarrier,
    putCarrier,
    deleteCarrier
} = require('../controllers/carrier');

//use for setting up the id to perform CRUD
//which will be the id passed in the url
carrierRouter.param("id", getCarrierId);

//GET
carrierRouter.get("/", getCarrier);

//GET by a single resource
carrierRouter.get("/:id", getCarrierById)

// //POST
carrierRouter.post("/", postCarrier);

//UPDATE
carrierRouter.put("/:id", putCarrier);

//DELETE
carrierRouter.delete("/:id", deleteCarrier);

module.exports = carrierRouter;
