import { StatusCodes } from "http-status-codes";
import { cardService } from "~/services/cardService";

const createNewCard = async (req, res, next) => {
  try {
    // Điều hướng dữ liệu sang tầng service
    const createdCard = await cardService.createNewCard(req.body);

    // Có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createdCard);
  } catch (error) {
    next(error);
  }
};

export const cardController = {
  createNewCard,
};
