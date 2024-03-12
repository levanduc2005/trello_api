import { boardModel } from "~/models/boardModel";
import { columnModel } from "~/models/columnModel";
import { cardModel } from "~/models/cardModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";

const createNewColumn = async (reqBody) => {
  try {
    // Xử lý logic dữ liệu
    const newColumn = {
      ...reqBody,
    };

    // Gọi tới tầng Model để xử lý lưu bản ghi newColumn vào trong Database
    const createdColumn = await columnModel.createNewColumn(newColumn);

    // Lấy bản ghi board sau khi tạo
    const getNewColumn = await columnModel.findOneById(
      createdColumn.insertedId
    );

    if (getNewColumn) {
      getNewColumn.cards = [];

      await boardModel.pushColumnId(getNewColumn);
    }

    // Trả kq về, trong service luôn phải return
    return getNewColumn;
  } catch (error) {
    throw error;
  }
};

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now(),
    };
    const updatedColumn = await columnModel.update(columnId, updateData);
    return updatedColumn;
  } catch (error) {
    throw error;
  }
};

const deleteColumn = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId);
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }
    // Xoá column
    await columnModel.deleteOneById(columnId);
    // Xoá all card trong column đó
    await cardModel.deleteAllCardByColumnId(columnId);
    // Xoá Id column trong board
    await boardModel.pullColumnId(targetColumn);

    return { deleteResult: "Column and its Cards deleted successfully!" };
  } catch (error) {
    throw error;
  }
};

export const columnService = {
  createNewColumn,
  update,
  deleteColumn,
};
