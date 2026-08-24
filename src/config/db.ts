import mongoose from 'mongoose';

const connectDB = async () => {
  const options = {
    maxPoolSize: 10, // Duy trì tối đa 10 kết nối đồng thời
    serverSelectionTimeoutMS: 5000, // Thất bại sau 5s nếu server không phản hồi
    socketTimeoutMS: 45000, // Ngắt socket sau 45s nếu không hoạt động
  };

  try {
    // Sử dụng biến môi trường MONGO_URI, hoặc mặc định kết nối tới localhost
    const mongoURI = process.env.MONGO_URI as string;

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Lỗi kết nối MongoDB: ${error.message}`);
    process.exit(1); // Dừng ứng dụng nếu không kết nối được tới DB
  }
  mongoose.connection.on('error', (err) => {
    console.error(`Lỗi kết nối MongoDB phát sinh: ${err}`);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('Cảnh báo: MongoDB bị ngắt kết nối Đang thực hiện kết nối lại...');
  });
};

export default connectDB;
