require('dotenv').config()

const express = require('express');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const exphbs  = require('express-handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressValidator());
app.use(cookieParser());

app.use(express.static('public'))

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);


if (require.main === module) {
    app.listen(process.env.PORT, () => {
        // console.log(`Listening at http://localhost:${process.env.PORT} `)
    });
}

module.exports = app;
