const createError = require('http-errors')
const UserModel = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken');

class AuthService{
    constructor(){

    }

    async registerUser(payload){
        try{
            const {email, password, phone_number, name} = payload;

            // Check if email exists
            const emailData = await UserModel.findOne({
                where: {
                    email: email
                }
            }).catch(err => {
                console.log("Error during checking user", err.message)
                throw createError.InternalServerError("Error during registration")
            })

            if (emailData) {
                throw createError.Conflict("User Email Already exists.")
            }

            // check if the phone exists
            const phoneData = await UserModel.findOne({
                where: {
                    phone_number: phone_number
                }
            }).catch(err => {
                console.log("Error during checking user", err.message)
                throw createError.InternalServerError("Error during registration")
            })

            if (phoneData) {
                throw createError.Conflict("Phone number already exists.")
            }
            
            // Generate password
            const randomkey = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, randomkey)

            // Insert User
            const userPayload = {
                email: email,
                password: hashedPassword,
                phone_number: phone_number,
                is_verified: 1,
                name: name
            }
            const newUser = await UserModel.create(userPayload).catch(err => {
                console.log("Error while adding table", err.message);
                throw createError.InternalServerError("Error during registration");
            });

            return newUser;
        }
        catch(err){
            throw err;
        }
    }

    async login(payload){
        try{

            const {email, password} = payload;
            if(!email){
                throw createError.BadRequest("Email Id cannot be null");
            }
            if(!password){
                throw createError.BadRequest("Password cannot be null");
            }

            const user = await UserModel.findOne({
                "where": {
                    email: email
                }
            }).catch(err => {
                console.log("Error during login",err);
                throw createError.InternalServerError("Error during Login")
            })

            if (!user) {
                throw createError.NotFound("User Not Registered");
            }

            const userPassword = user.dataValues.password;

            const isValid = await bcrypt.compare(password, userPassword);

            if (!isValid) {
                throw createError.Unauthorized("Email/Password not valid")
            }

            const tokenPayload = user.dataValues.id.toString();

            const accessToken = await this.generateAccessToken(tokenPayload);

            const refreshToken = await this.generateRefreshToken(tokenPayload);

            const data = {
                accessToken, refreshToken, "id": user.dataValues.id,"email":user.dataValues.email, "name":user.dataValues.name
            }

            return data

        }
        catch(err){
            throw err;
        }
    }

    async generateAccessToken(tokenPayload){
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRETKEY
            const options = {
                expiresIn: '10m',
                issuer: 'expensemanager',
                audience: tokenPayload,
            }
            jsonwebtoken.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(new createError.InternalServerError("Error during JWT Token Creation"))
                    return
                }
                resolve(token)
            })
        })
    }

    async generateRefreshToken(tokenPayload){
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRETKEY
            const options = {
                expiresIn: '1y',
                issuer: 'expensemanager',
                audience: tokenPayload,
            }
            jsonwebtoken.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(new createError.InternalServerError("Error during JWT token creation"))
                    return
                }
                resolve(token)
            })
        })
    }

    async verifyAccessToken(req, res, next) {
        if (!req.headers['authorization']) return next(new createError.Unauthorized("Please provide token"))
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRETKEY, (err, payload) => {
            if (err) {
                return next(new createError.Unauthorized("Token Invalid/Expired"))
            }
            const userId = payload.aud
            req.payload = userId;
            req.expireTime = payload.exp;
            next();
        })
    }

    async verifyRefreshToken(refreshToken) {
        return new Promise((resolve, reject) => {
            jsonwebtoken.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRETKEY,
                (err, payload) => {
                    if (err) return reject(createError.Unauthorized("Token Invalid/Expired"))
                    const userId = payload.aud
                    return resolve(userId)
                }
            )
        })
    }

    async generateNewAccessToken(payload) {
        try {
            const {refreshToken} = payload;
            if(!refreshToken) {
                throw createError.BadRequest("Refresh token cannot be empty");
            }
            const userId = await this.verifyRefreshToken(refreshToken);
            const accessToken = await this.generateAccessToken(userId);
            const data = {
                "accessToken": accessToken
            }
            return data
        }
        catch (err) {
            throw err;
        }
    }

    async getRemainingTokenTime(expiresAt){
        try{
            const currentTime = Math.floor(Date.now() / 1000);

            const timeDifference = expiresAt - currentTime;

            const minutes = Math.floor(timeDifference / 60);
            const seconds = timeDifference % 60;

            return `${minutes}:${seconds}`
        }
        catch(err){
            throw err;
        }
    }
}

module.exports = AuthService;