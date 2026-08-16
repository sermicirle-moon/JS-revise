const registerValidate = (req, res, next) => {
    const { username, password } = req.body;
    let errors = [];
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    // Kiểm tra Username
    if (username.length < 3 || username.length > 20) errors.push('Username must be between 3 and 20 characters long');
    if (!/^[a-zA-Z0-9]+$/.test(username)) errors.push('Username can only contain letters and numbers');

    // Kiểm tra Password
    if (password.length < 6 || password.length > 100) errors.push('Password must be between 6 and 100 characters long');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');

    // Nếu có bất kỳ lỗi nào, chặn lại và trả về danh sách lỗi ngay!
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }
    next();
}

module.exports = {
    registerValidate
};