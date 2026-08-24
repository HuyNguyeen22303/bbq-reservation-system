import { Request, Response } from 'express';
import Reservation from '../../models/Reservation';
import Table from '../../models/Table';

export const getDashboard = async (req: Request, res: Response) => {
    try {
        const totalTables = await Table.countDocuments();
        const pendingReservations = await Reservation.countDocuments({ status: 'pending' });
        
        res.render('admin/dashboard', { 
            title: 'Admin Dashboard - BBQ Reservation',
            totalTables,
            pendingReservations,
            path: '/admin' // used for sidebar active state
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).render('status/500', { title: 'Lỗi hệ thống' });
    }
};
