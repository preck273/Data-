const express = require('express');
const orderRouter = express.Router();

const {
    getOrder,
    getOrderId,
    getOrderById,
    postOrder,
    putOrder,
    deleteOrder
} = require('../controllers/orders');

//use for setting up the id to perform CRUD
//which will be the id passed in the url
orderRouter.param("id", getOrderId);

//GET
orderRouter.get("/", getOrder);

//GET by a single resource
orderRouter.get("/:id", getOrderById)

//POST
orderRouter.post("/", postOrder);

//UPDATE
orderRouter.put("/:id", putOrder);

//DELETE
orderRouter.delete("/:id", deleteOrder);

module.exports = orderRouter;
