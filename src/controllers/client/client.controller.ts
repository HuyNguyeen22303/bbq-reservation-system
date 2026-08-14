
import { Router, Request, Response, NextFunction } from 'express';


const getHomePage = (req: Request, res: Response) => {
    return res.render("client/home/show.ejs");
}




export { getHomePage }