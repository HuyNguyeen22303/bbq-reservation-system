import { Router } from 'express';
import { 
    index, 
    updateStatus, 
    destroy 
} from '../../controllers/admin/reservation.controller';

const router = Router();

router.get('/', index);
router.post('/status/:id', updateStatus);
router.post('/delete/:id', destroy);

export default router;
