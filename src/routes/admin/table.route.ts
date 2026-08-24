import { Router } from 'express';
import { 
    index, 
    create, 
    store, 
    edit, 
    update, 
    destroy 
} from '../../controllers/admin/table.controller';

const router = Router();

router.get('/', index);
router.get('/create', create);
router.post('/create', store);
router.get('/edit/:id', edit);
router.post('/edit/:id', update);
router.post('/delete/:id', destroy);

export default router;
