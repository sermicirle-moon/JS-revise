const authenService = require('../services/authenService');

const registerController = async (req, res) => {
    const {username, password } = req.body; 
    try {
        const { id, username: newUsername, token, refreshToken } = await authenService.registerUser(username, password);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,  // false vì đang chạy localhost. Khi lên mạng thật đổi thành true (HTTPS)
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    registerController
};