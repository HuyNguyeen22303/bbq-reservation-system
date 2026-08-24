import { Request, Response } from 'express';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

// GET /admin/users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const { search, role } = req.query;
        let query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (role) {
            query.role = role;
        }

        const users = await User.find(query).sort({ createdAt: -1 });
        res.render('admin/users/index', {
            title: 'Quản Lý Tài Khoản',
            path: '/admin/users',
            users,
            search: search || '',
            role: role || '',
            error: req.query.error,
            success: req.query.success
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin?error=Lỗi hệ thống');
    }
};

// GET /admin/users/create
export const getCreateUser = (req: Request, res: Response) => {
    res.render('admin/users/create', { title: 'Thêm Tài Khoản', path: '/admin/users', error: null });
};

// POST /admin/users/create
export const postCreateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, phone, password, role } = req.body;

        // Check email exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('admin/users/create', { error: 'Email đã tồn tại trong hệ thống' });
        }

        const hashedPassword = await bcrypt.hash(password || '123456', 10);

        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.redirect('/admin/users?success=Thêm tài khoản thành công');
    } catch (error) {
        console.error(error);
        res.render('admin/users/create', { error: 'Lỗi hệ thống' });
    }
};

// GET /admin/users/:id/edit
export const getEditUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.redirect('/admin/users?error=Không tìm thấy người dùng');
        }
        res.render('admin/users/edit', { title: 'Sửa Tài Khoản', path: '/admin/users', user, error: null });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/users?error=Lỗi hệ thống');
    }
};

// POST /admin/users/:id/edit
export const postEditUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, phone, role, password } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.redirect('/admin/users?error=Không tìm thấy người dùng');
        }

        user.name = name;
        user.phone = phone;
        user.role = role;

        if (password && password.trim() !== '') {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.redirect('/admin/users?success=Cập nhật tài khoản thành công');
    } catch (error) {
        console.error(error);
        const user = await User.findById(req.params.id);
        res.render('admin/users/edit', { user, error: 'Lỗi hệ thống khi cập nhật' });
    }
};

// POST /admin/users/:id/toggle-status
export const postToggleStatus = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.redirect('/admin/users?error=Không tìm thấy người dùng');
        }

        // Không cho phép Admin tự khóa chính mình
        const currentUser = (req.session as any).adminUser;
        if (currentUser.id === user.id) {
            return res.redirect('/admin/users?error=Bạn không thể tự khóa tài khoản của chính mình');
        }

        user.isActive = !user.isActive;
        await user.save();
        res.redirect(`/admin/users?success=Đã ${user.isActive ? 'mở khóa' : 'khóa'} tài khoản thành công`);
    } catch (error) {
        console.error(error);
        res.redirect('/admin/users?error=Lỗi hệ thống');
    }
};

// POST /admin/users/:id/delete
export const postDeleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.params.id;
        const currentUser = (req.session as any).adminUser;

        if (currentUser.id === userId) {
            return res.redirect('/admin/users?error=Bạn không thể tự xóa tài khoản của chính mình');
        }

        await User.findByIdAndDelete(userId);
        res.redirect('/admin/users?success=Đã xóa tài khoản thành công');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/users?error=Lỗi hệ thống khi xóa');
    }
};
