import { Router, Request, Response, NextFunction } from 'express';
import { createReservationService } from '../../services/reservation.service';


const getHomePage = (req: Request, res: Response) => {
    return res.render("client/home/show.ejs");
}


const getBookingPage = (req: Request, res: Response) => {
    return res.render("client/reservation/show.ejs");
}


const getMenuPage = (req: Request, res: Response) => {
    return res.render("client/menu/show.ejs");
}


const postHandlerBooking = async (req: Request, res: Response) => {
    try {
        const formData = req.body;

        // Chuyển dữ liệu sang Service để xử lý lưu vào Database
        const result = await createReservationService(formData);


        return res.render("status/200.ejs", { guestName: result.guestInfo?.name });
    } catch (error: any) {
        console.error("Lỗi khi đặt bàn:", error);
        return res.status(500).render("status/500.ejs", { message: "Đã xảy ra lỗi khi xử lý thông tin đặt bàn của bạn. Vui lòng thử lại sau!" });
    }
}


export { getHomePage, getBookingPage, getMenuPage, postHandlerBooking }