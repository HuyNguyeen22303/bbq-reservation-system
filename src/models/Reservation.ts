import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation extends Document {
  user?: mongoose.Types.ObjectId;
  guestInfo?: {
    name: string;
    phone: string;
  };
  table: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  partySize: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    guestInfo: {
      name: { type: String },
      phone: { type: String }
    },
    table: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
    date: { type: Date, required: true },
    time: { 
      type: String, 
      required: true,
      // Thời gian linh hoạt trong ngày từ 11:00 đến 21:30
      validate: {
        validator: function(v: string) {
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (!timeRegex.test(v)) return false;
          
          const parts = v.split(':');
          const hours = parseInt(parts[0], 10);
          const mins = parseInt(parts[1], 10);
          const timeInMinutes = hours * 60 + mins;
          
          const startMinutes = 11 * 60; // 11:00
          const endMinutes = 21 * 60 + 30; // 21:30
          
          return timeInMinutes >= startMinutes && timeInMinutes <= endMinutes;
        },
        message: (props: any) => `${props.value} không phải là khung giờ hợp lệ. Vui lòng chọn từ 11:00 đến 21:30.`
      }
    },
    partySize: { type: Number, required: true, min: 1 },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
      default: 'pending' 
    },
    specialRequests: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IReservation>('Reservation', ReservationSchema);
