import { Reservation, Table } from '../models';

export const createReservationService = async (formData: any) => {

    const { date, time, guests, name, phone } = formData;


    let table = await Table.findOne({ capacity: { $gte: Number(guests) } });

    //Tao fake mot cai table
    if (!table) {
        table = await Table.create({
            tableNumber: `T-${Math.floor(Math.random() * 1000)}`,
            capacity: Number(guests) > 4 ? Number(guests) : 4,
            location: 'indoor'
        });
    }


    const newReservation = new Reservation({
        guestInfo: { name, phone },
        table: table._id,
        date: new Date(date),
        time: time,
        partySize: Number(guests),
        status: 'pending'
    });


    await newReservation.save();


    return newReservation;
};
