const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/User.model')

const isLoggedIn = async(req,res,next) =>{

    const authorization= req.header.authorization
    if (!authorization){
        res.status(401).json({ message: 'Missing Authorization header' })
    return
    }

    const token = authorization.replace('Bearer ', '')
    try {
        const decodedJwt = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
        const { username } = decodedJwt
    const user = await User.findOne({ username })
    req.user = user
}
catch (error) {
    // invalid token
    res.status(401).json({ message: 'Invalid token' })
    return
}
next()
}

module.exports = isLoggedIn