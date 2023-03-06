const jwt = require("jsonwebtoken");
const secretKey = "RahasiaBanget";
const pool = require("../config.js");

function authentication(req, res, next) {

    const {access_token} = req.headers;

    if(access_token){

        try { const decoded = jwt.verify(access_token, secretKey);
            const {id, email} = decoded
            const findUser = `
                SELECT *
                FROM users
                WHERE id = $1
            `

            pool.query(findUser, [id], (err, result) => {
                if(err) next(err);
                
                if(result.rows.length === 0){
                    next({name: "ErrorNotFound"})
                } else {
                    const user = result.rows[0]
    
                    req.loggedUser = {
                        id: user.id,
                        email: user.email
                    }
                    next();
                    }
                })
            
            } catch(err) {next({name: "JWTerror"})}
    } else {
        next({name:"Unauthenticated"})
    }
}

function authorization(req, res, next) {
    
    console.log(req.loggedUser);
    const {role, email, id} = req.loggedUser;

    if(role === "Project Manager") {
        next();
    } else {
        next({name: "Unauthorized"})
    }
}

module.exports = {
    authentication,
    authorization
}