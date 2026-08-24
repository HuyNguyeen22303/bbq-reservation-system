import { Router } from 'express';
import { requireRole } from '../../middlewares/adminAuth';
import {
    getUsers,
    getCreateUser,
    postCreateUser,
    getEditUser,
    postEditUser,
    postToggleStatus,
    postDeleteUser
} from '../../controllers/admin/user.controller';

const router = Router();

// Chỉ Admin mới được quản lý tài khoản
router.use(requireRole(['admin']));

router.get('/', getUsers);
router.get('/create', getCreateUser);
router.post('/create', postCreateUser);
router.get('/:id/edit', getEditUser);
router.post('/:id/edit', postEditUser);
router.post('/:id/toggle-status', postToggleStatus);
router.post('/:id/delete', postDeleteUser);

export default router;
