const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const authenValidator = require('../validators/authenValidate');
const crypto = require('crypto');

const registerUser = async (username, password) => {
    try{
        const user = await prisma.user.findUnique({
            where: { 
            username: username
            },
        });
        if(user){
            throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data:{
                username: username,
                password: hashedPassword,
            }
        });

        const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = crypto.randomBytes(64).toString('hex');

        const updatedUser = await prisma.user.update({
            where: { id: newUser.id },
            data: { refresh: refreshToken }
        });

        return { id: newUser.id, username: newUser.username, token, refreshToken };
    } catch (error) {
        throw new Error(error.message + "HELLO");
    }
};

module.exports = {
    registerUser
};