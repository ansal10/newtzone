const genUtil = require( "../utilities/genutils/index" );
const models = require( "../db/models/index" );
const config = require('../config/index');
const jwt = require('jsonwebtoken');

const isAuthenticated = async ( req, res, next ) => {

    let token = req.cookies.access_token || req.headers.access_token;

    if ( token ) {
        try {
            let data = jwt.verify(token, config.JWT_SECRET);
            let user = await models.User.findOne({where: {id: data.user_id}});
            if (user && user.status === 'active') {
                req.session.user = user;
                return next();
            } else {
                genUtil.sendJsonResponse(res, 401, "Unauthorized access");
            }
        } catch (e) {
            genUtil.sendJsonResponse(res, 401, "Unauthorized access");
        }
    }else {

        // let u = await models.User.findOne( { "where": {
        //     "email": "inboxpk22@gmail.com"
        // } } );
        //
        // req.session.user = u;
        // return next();


        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        genUtil.sendJsonResponse(res, 401, "Unauthorized access", null);
    }
};


module.exports.isAuthenticated = isAuthenticated;
