const express = require('express');
const apiRouter = express.Router();

const carrierRouter = require('./carrier');
const operatorRouter = require('./operator');
const  orderRouter = require('./orders');
const stationRouter = require('./station');

apiRouter.use('/carrier', carrierRouter);
apiRouter.use('/operator', operatorRouter);
apiRouter.use('/order', orderRouter);
apiRouter.use('/station', stationRouter);

module.exports = apiRouter;
