import { Router, Request, Response, NextFunction } from 'express';
import { getHomePage, getBookingPage, getMenuPage, postHandlerBooking } from '../../controllers/client/client.controller';
const router = Router();


router.get('/', getHomePage);
router.get('/menu', getMenuPage);
router.get('/booking', getBookingPage);
router.post('/booking', postHandlerBooking);

export default router;
