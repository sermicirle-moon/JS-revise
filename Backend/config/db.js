const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

// 1. Tạo Pool kết nối như cũ
const pool = new Pool({ connectionString });

// 2. Bọc Pool lại bằng Adapter của Prisma
const adapter = new PrismaPg(pool);

// 3. Khởi tạo Prisma Client với Adapter đó
const prisma = new PrismaClient({ adapter });

// Xuất ra để các file Controller/API khác lấy dùng
module.exports = prisma;