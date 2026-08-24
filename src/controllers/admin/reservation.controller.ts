import { Request, Response } from 'express';
import Reservation from '../../models/Reservation';

// Hiển thị danh sách đặt bàn
export const index = async (req: Request, res: Response) => {
    try {
        const statusFilter = req.query.status as string;
        const query: any = statusFilter ? { status: statusFilter } : {};

        const reservations = await Reservation.find(query)
            .populate('table')
            .populate('user', 'name email phone')
            .sort({ date: 1, time: 1 });

        res.render('admin/reservations/index', {
            title: 'Quản lý Đặt Bàn - BBQ Reservation',
            reservations,
            statusFilter,
            path: '/admin/reservations'
        });
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).render('status/500', { title: 'Lỗi hệ thống' });
    }
};

// Cập nhật trạng thái đặt bàn
export const updateStatus = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).send('Trạng thái không hợp lệ!');
        }

        await Reservation.findByIdAndUpdate(id, { status });

        // Quay lại trang trước đó để giữ lại bộ lọc (nếu có)
        const redirectUrl = req.get('Referrer') || '/admin/reservations';
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Error updating reservation status:', error);
        res.status(500).render('status/500', { title: 'Lỗi hệ thống' });
    }
};

// Xoá yêu cầu đặt bàn
export const destroy = async (req: Request, res: Response) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.redirect('/admin/reservations');
    } catch (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).render('status/500', { title: 'Lỗi hệ thống' });
    }
};
