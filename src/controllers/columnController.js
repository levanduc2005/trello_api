import { StatusCodes } from "http-status-codes";
import { columnService } from "~/services/columnService";

const createNewColumn = async (req, res, next) => {
  try {
    // Điều hướng dữ liệu sang tầng service
    const createdColumn = await columnService.createNewColumn(req.body);

    // Có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createdColumn);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const columnId = req.params.id;

    // Điều hướng dữ liệu sang tầng service
    const updatedColumn = await columnService.update(columnId, req.body);

    // Có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(updatedColumn);
  } catch (error) {
    next(error);
  }
};

const deleteColumn = async (req, res, next) => {
  try {
    const columnId = req.params.id;

    // Điều hướng dữ liệu sang tầng service
    const result = await columnService.deleteColumn(columnId);

    // Có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const columnController = {
  createNewColumn,
  update,
  deleteColumn,
};
