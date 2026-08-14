import { Router, Request, Response, NextFunction } from 'express';
import { getHomePage } from '../../controllers/client/client.controller';
const router = Router();


router.get('/', getHomePage);

export default router;
