import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";

const createNewCard = async (reqBody) => {
  try {
    // Xử lý logic dữ liệu
    const newCard = {
      ...reqBody,
    };

    // Gọi tới tầng Model để xử lý lưu bản ghi newCard vào trong Database
    const createdCard = await cardModel.createNewCard(newCard);

    // Lấy bản ghi board sau khi tạo
    const getNewCard = await cardModel.findOneById(createdCard.insertedId);

    if (getNewCard) {
      // getNewCard.cards = [];

      await columnModel.pushCardId(getNewCard);
    }

    // Trả kq về, trong service luôn phải return
    return getNewCard;
  } catch (error) {
    throw error;
  }
};

export const cardService = {
  createNewCard,
};
