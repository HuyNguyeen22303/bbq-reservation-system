import { Request, Response, NextFunction } from 'express';

export const requireAdminLogin = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && (req.session as any).adminUser) {
        res.locals.adminUser = (req.session as any).adminUser;
        next();
    } else {
        res.redirect('/admin/login');
    }
};

export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req.session as any).adminUser;
        if (user && roles.includes(user.role)) {
            next();
        } else {
            res.status(403).send('Bạn không có quyền truy cập chức năng này.');
        }
    };
};
