const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
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
        
        const refreshToken = crypto.randomBytes(64).toString('hex');

        const newUser = await prisma.user.create({
            data:{
                username: username,
                password: hashedPassword,
                refresh: refreshToken
            }
        });

        const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '15m' });

        return { id: newUser.id, username: newUser.username, token, refreshToken };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    registerUser
};