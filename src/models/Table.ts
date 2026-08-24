import mongoose, { Schema, Document } from 'mongoose';

export interface ITable extends Document {
  tableNumber: string;
  capacity: number;
  location: 'indoor' | 'outdoor' | 'vip';
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema: Schema = new Schema(
  {
    tableNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    location: { 
      type: String, 
      enum: ['indoor', 'outdoor', 'vip'], 
      default: 'indoor' 
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITable>('Table', TableSchema);
