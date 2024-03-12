import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardRoute } from "./boardRoute";
import { columnRoute } from "./columnRoute";
import { cardRoute } from "./cardRoute";

const Router = express.Router();

// Check Apis v1/status
Router.get("/status", (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ message: "APIs V1 are ready to be deployed" });
});

// Board APId
Router.use("/boards", boardRoute);

// Column APId
Router.use("/columns", columnRoute);

// Card APId
Router.use("/cards", cardRoute);

export const APIs_V1 = Router;
