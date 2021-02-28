import express = require('express');
var cors = require('cors')
import { loadErrorHandlers } from './utilities/error-handling';
import * as bodyParser from 'body-parser';

const app: express.Application = express();

app.use(bodyParser.json());
app.use(cors());
app.use(require('./routes'));
loadErrorHandlers(app);

app.listen(8000, function () {
    console.log('App is running!');
});