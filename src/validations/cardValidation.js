/* eslint-disable no-console */
import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNewCard = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),

    title: Joi.string().required().min(3).max(50).trim().strict(),
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

export const cardValidation = {
  createNewCard,
};
