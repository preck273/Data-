const express = require('express');
const operatorRouter = express.Router();

const {
    getOperator,
    getOperatorId,
    getOperatorById,
    postOperator,
    putOperator,
    deleteOperator
} = require('../controllers/operator');

//use for setting up the id to perform CRUD
//which will be the id passed in the url
operatorRouter.param("id", getOperatorId);

//GET
operatorRouter.get("/", getOperator);

//GET by a single resource
operatorRouter.get("/:id", getOperatorById)

//POST
operatorRouter.post("/", postOperator);

//UPDATE
operatorRouter.put("/:id", putOperator);

//DELETE
operatorRouter.delete("/:id", deleteOperator);

module.exports = operatorRouter;
