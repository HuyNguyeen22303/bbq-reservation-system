import { Router } from 'express';
import { getDashboard } from '../../controllers/admin/dashboard.controller';

import tableRoutes from './table.route';

import reservationRoutes from './reservation.route';

const router = Router();

// Dashboard Route
router.get('/', getDashboard);

router.use('/tables', tableRoutes);
router.use('/reservations', reservationRoutes);

import userRoutes from './user.route';
router.use('/users', userRoutes);

export default router;
