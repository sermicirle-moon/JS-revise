const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

// Lấy tên schema từ DATABASE_URL (vd: ?schema=TEST), mặc định là 'public'
const schemaName = new URL(connectionString).searchParams.get('schema') || 'public';

// 1. Tạo Pool kết nối
const pool = new Pool({ connectionString });

// 2. Bọc Pool lại bằng Adapter của Prisma, truyền schema để set search_path
const adapter = new PrismaPg(pool, { schema: schemaName });

// 3. Khởi tạo Prisma Client với Adapter đó
const prisma = new PrismaClient({ adapter });

// Xuất ra để các file Controller/API khác lấy dùng
module.exports = prisma;