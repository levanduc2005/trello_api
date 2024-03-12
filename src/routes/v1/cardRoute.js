import express from "express";
import { cardValidation } from "~/validations/cardValidation";
import { cardController } from "~/controllers/cardController";

const Router = express.Router();

Router.route("/").post(
  cardValidation.createNewCard,
  cardController.createNewCard
);

export const cardRoute = Router;
