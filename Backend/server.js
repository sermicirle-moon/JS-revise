// file: server.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const authenRouter = require('./routes/authenRoute');

const app = express();

// ==========================================
// TẦNG 1: BẢO VỆ BÊN NGOÀI (SECURITY HEADERS & CORS)
// ==========================================

// 1. Helmet: Đứng ngoài cùng, tự động che giấu thông tin server (VD: giấu chữ Express) và chặn các cuộc tấn công XSS, Clickjacking.
app.use(helmet());

// 2. CORS: Kiểm duyệt biên giới. Chỉ cho phép Frontend được chỉ định mới có quyền gọi API.
app.use(cors({
    // Ở localhost bạn dùng cổng của Live Server (VD: 5500). Khi lên mạng, đổi thành 'https://your-frontend-domain.com'
    origin: 'http://localhost:5173', 
    credentials: true // Cho phép gửi nhận Cookie chứa Refresh Token
}));


// ==========================================
// TẦNG 2: KIỂM SOÁT LƯU LƯỢNG & KÍCH THƯỚC (RATE LIMIT & BODY PARSER)
// ==========================================

// 3. Rate Limiter: Đếm số lần gõ cửa. Chống Brute Force (dò mật khẩu) và Spam (DDoS cùi bắp).
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Khung thời gian: 15 phút
    max: 20, // Tối đa 20 lần request đăng ký/đăng nhập từ 1 địa chỉ IP trong 15 phút
    message: { error: 'Bạn đã thao tác quá nhiều lần. Vui lòng thử lại sau 15 phút!' },
    standardHeaders: true, // Trả về thông tin limit trong header chuẩn
    legacyHeaders: false,
});

// Chỉ áp dụng giới hạn gắt gao này cho các API xác thực (tránh việc chặn nhầm khách đang xài app bình thường)
app.use('/api/register', authLimiter);
// app.use('/api/login', authLimiter); // Sau này bạn mở dòng này cho Login

// 4. Request Size Limit: Bóc gói tin ra. Cấm Frontend gửi cục data (JSON) quá 10KB để chống sập RAM.
app.use(express.json({ limit: '10kb' })); 

// 5. Bóc thẻ Cookie
app.use(cookieParser());


// ==========================================
// TẦNG 3: ĐIỀU HƯỚNG VÀO BÊN TRONG NHÀ MÁY (ROUTES)
// ==========================================

app.use('/api', authenRouter);

// ==========================================
// KHỞI ĐỘNG MÁY CHỦ
// ==========================================
const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server đang chạy an toàn trên cổng ${PORT}`);
});