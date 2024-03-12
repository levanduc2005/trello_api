/* eslint-disable no-console */
import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors";
import exitHook from "async-exit-hook";
import { CONNECT_DB, CLOSE_DB } from "~/config/mongodb";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";

const START_SERVE = () => {
  const app = express();

  // Xử lý cors
  app.use(cors(corsOptions));

  //enable req.body data
  app.use(express.json());

  //use api v1
  app.use("/v1", APIs_V1);

  // Middleware handle lỗi tập trung
  app.use(errorHandlingMiddleware);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(
      `${env.AUTHOR}, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`
    );
  });

  exitHook(() => {
    console.log("exit app");
    CLOSE_DB();
  });
};

// Chỉ khi kết nối Database thành công thì mới Start Server Back-end lên.
CONNECT_DB()
  .then(() => console.log("Connected to MongoDB Cloud Atlas"))
  .then(() => START_SERVE())
  .catch((error) => {
    console.error(error);
    process.exit(0);
  });
