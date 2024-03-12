import express from "express";
import { columnValidation } from "~/validations/columnValidation";
import { columnController } from "~/controllers/columnController";

const Router = express.Router();

Router.route("/").post(
  columnValidation.createNewColumn,
  columnController.createNewColumn
);

Router.route("/:id")
  .put(columnValidation.update, columnController.update)
  .delete(columnValidation.deleteColumn, columnController.deleteColumn);

export const columnRoute = Router;
