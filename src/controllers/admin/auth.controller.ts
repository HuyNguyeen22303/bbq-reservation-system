import { Request, Response } from 'express';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export const getLogin = (req: Request, res: Response) => {
    if ((req.session as any).adminUser) {
        return res.redirect('/admin');
    }
    res.render('admin/login', { error: null });
};

export const postLogin = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        
        // Kiểm tra tài khoản có tồn tại và có quyền admin/staff không
        if (!user || !['admin', 'staff'].includes(user.role)) {
            return res.render('admin/login', { error: 'Tài khoản không tồn tại hoặc không có quyền truy cập.' });
        }

        // Kiểm tra tài khoản có bị khóa không
        if (user.isActive === false) {
            return res.render('admin/login', { error: 'Tài khoản của bạn đã bị khóa.' });
        }
        
        // Kiểm tra mật khẩu (hỗ trợ cả mật khẩu chưa mã hoá hoặc đã mã hoá bcrypt)
        let isMatch = false;
        if (user.password && user.password.startsWith('$2')) {
             isMatch = await bcrypt.compare(password, user.password);
        } else {
             isMatch = (password === user.password);
        }

        if (!isMatch) {
            return res.render('admin/login', { error: 'Sai mật khẩu.' });
        }

        // Lưu thông tin vào session
        (req.session as any).adminUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.render('admin/login', { error: 'Lỗi hệ thống khi đăng nhập.' });
    }
};

export const logout = (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
};

// Route ẩn để tạo tài khoản Admin mặc định (chỉ dùng khi khởi tạo)
export const setupDefaultAdmin = async (req: Request, res: Response): Promise<any> => {
    try {
        const adminExists = await User.findOne({ email: 'admin@bbq.com' });
        if (adminExists) {
            return res.send('Tài khoản admin@bbq.com đã tồn tại!');
        }

        const hashedPassword = await bcrypt.hash('123456', 10);
        const admin = new User({
            name: 'Quản trị viên',
            email: 'admin@bbq.com',
            password: hashedPassword,
            phone: '0123456789',
            role: 'admin'
        });
        await admin.save();
        res.send('Đã tạo tài khoản Admin thành công! Email: admin@bbq.com - Pass: 123456. Hãy vào /admin/login để đăng nhập.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi hệ thống.');
    }
};
