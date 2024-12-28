import { Request, Response } from "express";
import {
  deleteAllMessageServices,
  getAllMessageServices,
} from "services/chatBotService";

type ChatBotMiddlewareProps = {
  email: string;
};

export const chatBotController = async (
  req: Request & ChatBotMiddlewareProps,
  res: Response
) => {
  try {
    const response = await getAllMessageServices(req.email);
    res.status(200).json({
      ...response,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: 0,
      message: error,
    });
  }
};

export const deleteMessageController = async (
  req: Request & ChatBotMiddlewareProps,
  res: Response
) => {
  try {
    const response = await deleteAllMessageServices(req.email);
    res.status(200).json({
      ...response,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: 0,
      message: error,
    });
  }
};
