import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "~/config/environment";

// khởi tạo một đối tượng trelloDatabaseInstance ban đầu là null (vì chúng ta chưa connect)
let trelloDatabaseInstance = null;

// Khởi tạo một đối tượng Client Instance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Kết nối tới Database
export const CONNECT_DB = async () => {
  // Gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của clientInstance
  await mongoClientInstance.connect();

  // Sau khi await kết nối thành công
  // Lấy ra Database theo tên và gán cho trelloDatabaseInstance
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

// export trelloDatabaseInstance sau khi connect thành công tới MongoDB để sử dụng
// Phải đảm bảo chỉ gọi GET_DB sau khi đã connect thành công tới MongoDB
export const GET_DB = () => {
  if (!trelloDatabaseInstance)
    throw new Error("Must connect to Database first");
  return trelloDatabaseInstance;
};

// Đóng kết nối tới Database
export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
};
