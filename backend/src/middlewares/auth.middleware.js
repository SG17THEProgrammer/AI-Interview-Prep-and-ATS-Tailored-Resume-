const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")



async function authUser(req, res, next) {

    const token = req.cookies.token

    // console.log("token from cookie", token)

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "Invalid token. Maybe it is expired. Login Again "
        })
    }

}
async function authLogin(req, res, next) {
    try {
        const token = req.cookies.token

        // No token → user is not logged in
        if (!token) {
            return next()
        }

        // Check blacklist
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({
            token
        })

        if (isTokenBlacklisted) {
            return next()
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET)

        // If token valid → already logged in
        return res.status(403).json({
            message: "You are already logged in"
        })

    } catch (err) {
        console.log(err);
        // Invalid/expired token → allow login again
        return next()
    }
}


module.exports = { authUser, authLogin }