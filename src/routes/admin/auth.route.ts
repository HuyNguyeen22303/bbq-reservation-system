import { Router } from 'express';
import { getLogin, postLogin, logout, setupDefaultAdmin } from '../../controllers/admin/auth.controller';

const router = Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', logout);

// Đường dẫn tạo admin mặc định
router.get('/setup-admin', setupDefaultAdmin);

export default router;
