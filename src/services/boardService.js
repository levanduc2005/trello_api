import { slugify } from "~/utils/formatters";
import { boardModel } from "~/models/boardModel";
import { columnModel } from "~/models/columnModel";
import { cardModel } from "~/models/cardModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";

const createNewBoard = async (reqBody) => {
  try {
    // Xử lý logic dữ liệu
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(newBoard);

    // Lấy bản ghi board sau khi tạo
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);

    // Trả kq về, trong service luôn phải return
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }

    // deepClone board ra một cái mới để xử lý, không ảnh hưởng đến board ban đầu.
    const resBoard = cloneDeep(board);
    // Đưa card về đúng column
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter(
        // objectId trong mongoDB có hỗ trợ equals
        (card) => card.columnId.toString() === column._id.toString()
      );
    });

    // Xoá mảng cards ra khỏi board
    delete resBoard.cards;

    // Trả kq về, trong service luôn phải return
    return resBoard;
  } catch (error) {
    throw error;
  }
};

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now(),
    };
    const updatedBoard = await boardModel.update(boardId, updateData);
    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    await columnModel.update(reqBody.preColumnId, {
      cardOrderIds: reqBody.preCardOrderIds,
      updateAt: Date.now(),
    });

    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updateAt: Date.now(),
    });

    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updateAt: Date.now(),
    });

    return { updateResult: "successfully!" };
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNewBoard,
  getDetails,
  update,
  moveCardToDifferentColumn,
};
