import { Request, Response } from 'express';
import Table from '../../models/Table';

// Hiển thị danh sách bàn
const index = async (req: Request, res: Response) => {
    try {
        const tables = await Table.find().sort({ createdAt: -1 });
        res.render('admin/tables/index', {
            title: 'Quản lý Bàn - BBQ Reservation',
            tables,
            path: '/admin/tables'
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('status/500', { title: 'Lỗi hệ thống' });
    }
};

// Hiển thị form tạo bàn mới
const create = (req: Request, res: Response) => {
    res.render('admin/tables/create', {
        title: 'Thêm Bàn Mới - BBQ Reservation',
        path: '/admin/tables'
    });
};

// Xử lý lưu bàn mới
const store = async (req: Request, res: Response) => {
    try {
        const { tableNumber, capacity, location, isAvailable } = req.body;

        // Kiểm tra xem số bàn đã tồn tại chưa
        const existingTable = await Table.findOne({ tableNumber });
        if (existingTable) {
            return res.render('admin/tables/create', {
                title: 'Thêm Bàn Mới - BBQ Reservation',
                path: '/admin/tables',
                error: 'Số bàn này đã tồn tại!'
            });
        }

        const newTable = new Table({
            tableNumber,
            capacity,
            location,
            isAvailable: isAvailable === 'on' || isAvailable === 'true'
        });

        await newTable.save();
        res.redirect('/admin/tables');
    } catch (error) {
        console.error(error);
        res.status(500).render('status/500', { title: 'Lỗi hệ thống' });
    }
};

// Hiển thị form sửa bàn
const edit = async (req: Request, res: Response): Promise<any> => {
    try {
        const table = await Table.findById(req.params.id);
        if (!table) {
            return res.status(404).render('status/404', { title: 'Không tìm thấy bàn' });
        }
        res.render('admin/tables/edit', {
            title: 'Sửa Bàn - BBQ Reservation',
            table,
            path: '/admin/tables'
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('status/500', { title: 'Lỗi hệ thống' });
    }
};

// Xử lý cập nhật bàn
const update = async (req: Request, res: Response): Promise<any> => {
    try {
        const { tableNumber, capacity, location, isAvailable } = req.body;
        const tableId = req.params.id;

        // Kiểm tra số bàn có trùng với bàn khác không
        const existingTable = await Table.findOne({ tableNumber, _id: { $ne: tableId } });
        if (existingTable) {
            const table = await Table.findById(tableId);
            return res.render('admin/tables/edit', {
                title: 'Sửa Bàn - BBQ Reservation',
                path: '/admin/tables',
                table,
                error: 'Số bàn này đã được sử dụng!'
            });
        }

        await Table.findByIdAndUpdate(tableId, {
            tableNumber,
            capacity,
            location,
            isAvailable: isAvailable === 'on' || isAvailable === 'true'
        });

        res.redirect('/admin/tables');
    } catch (error) {
        console.error(error);
        res.status(500).render('status/500', { title: 'Lỗi hệ thống' });
    }
};

// Xử lý xoá bàn
const destroy = async (req: Request, res: Response) => {
    try {
        await Table.findByIdAndDelete(req.params.id);
        res.redirect('/admin/tables');
    } catch (error) {
        console.error(error);
        res.status(500).render('status/500', { title: 'Lỗi hệ thống' });
    }
};



export { index, create, store, edit, update, destroy }