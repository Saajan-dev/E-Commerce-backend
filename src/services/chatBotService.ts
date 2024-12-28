import { prisma } from "loader/prisma";

export const getAllMessageServices = async (email: string) => {
  try {
    const isExistinguser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!isExistinguser) {
      return {
        status: -1,
        message: "User not found",
      };
    }

    const response = await prisma.chatbot.findMany();

    const transformedMessages = response.map((message) => ({
      chatbot_id: message.chatbot_id,
      sender: message.sender_msg ? "user" : "bot",
      sender_msg: message.sender_msg || "",
      receiver_msg: message.receiver_msg || {},
    }));
    return {
      status: 1,
      message: "Fetched all messages.",
      data: [...transformedMessages],
    };
  } catch (error) {
    throw error;
  }
};

export const deleteAllMessageServices = async (email: string) => {
  try {
    const isExistinguser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!isExistinguser) {
      return {
        status: -1,
        message: "User not found",
      };
    }

    await prisma.chatbot.deleteMany();

    return {
      status: 1,
      message: "All messages deleted successfully.",
    };
  } catch (error) {
    throw error;
  }
};
