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

  if (env.BUILD_MODE === "production") {
    // Build code ở env production
    app.listen(process.env.PORT, () => {
      console.log(
        `${env.AUTHOR}, I am running successfully at port ${process.env.PORT}`
      );
    });
  } else {
    // Build code ở env dev
    app.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(
        `${env.AUTHOR}, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`
      );
    });
  }

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
