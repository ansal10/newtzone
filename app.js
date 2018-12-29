const createError = require( "http-errors" );
const express = require( "express" );
const path = require( "path" );
const cookieParser = require( "cookie-parser" );
const lessMiddleware = require( "less-middleware" );
const logger = require( "morgan" );
const session = require( "express-session" );
const swaggerUi = require( "swagger-ui-express" );
const swaggerDocument = require( "./swagger.json" );
const indexRouter = require( "./controllers/api/v1/index" );
const usersRouter = require( "./controllers/api/v1/users" );
const timezoneRouter = require( "./controllers/api/v1/timezones" );
const app = express();
const compression = require( "compression" );

app.use( session( { "secret": "SecretNumber%$^&$^", "cookie": { "maxAge": 1000 * 60 * 60 * 24 } } ) );  // 24 hour max age

// CORS
app.use( ( req, res, next ) => {
    res.header( "Access-Control-Allow-Origin", "*" );
    res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
    next();
} );

app.use( compression() );


// view engine setup
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

app.use( logger( "dev" ) );
app.use( express.json() );
app.use( express.urlencoded( { "extended": true } ) );
app.use( cookieParser() );
// app.use( express.bodyParser( { "uploadDir": "/tmp" } ) );
app.use( lessMiddleware( path.join( __dirname, "public" ) ) );
app.use( express.static( path.join( __dirname, "public" ) ) );
app.use( express.static( path.join( __dirname, "build" ) ) );

app.use( "/api-docs", swaggerUi.serve, swaggerUi.setup( swaggerDocument ) );


app.use( "/api/v1/user", usersRouter );
app.use( "/api/v1/timezone", timezoneRouter );
app.use( "/", indexRouter );

// catch 404 and forward to error handler
app.use( ( req, res, next ) => {
    next( createError( 404 ) );
} );

// error handler
app.use( ( err, req, res, next ) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err ;

    // render the error page
    res.status( err.status || 500 );
    res.render( "error" );
} );

module.exports = app;
