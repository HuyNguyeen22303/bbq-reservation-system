import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import appClient from './routes/client/client.route';
import appAdmin from './routes/admin/admin.route';
import authAdmin from './routes/admin/auth.route';
import { requireAdminLogin } from './middlewares/adminAuth';
import 'dotenv/config'
import path from 'path';
import connectDB from './config/db'; // Thêm import db

const app = express();
const port = process.env.PORT || 9000;

// Thực thi hàm kết nối MongoDB
connectDB();

app.use(express.json()); // Read data json
app.use(express.urlencoded({ extended: true })); // Read data from HTML Form (POST request)

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60
    }),
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 ngày
}));

app.use(express.static(path.join(__dirname, '../public'))); // config file static public

app.set('views', path.join(__dirname, 'views'));  // config views

app.set('view engine', 'ejs') // config ejs

app.use("/admin", authAdmin); // route auth (login, logout)
app.use("/admin", requireAdminLogin, appAdmin); // route app admin (được bảo vệ)
app.use("/", appClient); // route app client

// 404 Not Found Middleware
app.use((req: Request, res: Response) => {
    res.status(404).render('status/404.ejs', { title: '404 - Không tìm thấy trang' });
});

// 500 Global Error Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error:", err.stack);
    res.status(500).render('status/500.ejs', { title: '500 - Lỗi hệ thống' });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
