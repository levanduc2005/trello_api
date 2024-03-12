/* eslint-disable no-console */
import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNewBoard = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid("public", "private").required(),
  });

  try {
    //chỉ định obortEarly: false để trả về all errors validation
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const messageError = new Error(error).message;
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      messageError
    );
    next(customError);
  }
};

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid("public", "private"),
    columnOrderIds: Joi.array()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      )
      .default([]),
  });

  try {
    //chỉ định obortEarly: false để trả về all errors validation
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    next();
  } catch (error) {
    const messageError = new Error(error).message;
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      messageError
    );
    next(customError);
  }
};

const moveCardToDifferentColumn = async (req, res, next) => {
  const correctCondition = Joi.object({
    currentCardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    preColumnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    preCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),
    nextColumnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),
  });

  try {
    //chỉ định obortEarly: false để trả về all errors validation
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const messageError = new Error(error).message;
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      messageError
    );
    next(customError);
  }
};

export const boardValidation = {
  createNewBoard,
  update,
  moveCardToDifferentColumn,
};
