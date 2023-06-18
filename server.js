const express = require("express")
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.raw({type: 'application/xml'}));

app.use(cors());

app.use(morgan('dev'))

app.use(errorHandler());
const routerApi = require = require('./routes/api');

app.use('/api', routerApi);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`The server is running @ http://localhost:${PORT}`);
})

module.exports = app;
