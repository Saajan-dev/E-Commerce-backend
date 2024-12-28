import { prisma } from "loader/prisma";

export const chatbotService = async (product_name: string) => {
  try {
    const productResponse = await prisma.products.findUnique({
      where: {
        name: product_name,
      },
    });
    if (!productResponse) {
      return {
        status: 0,
        message: "Product not found.",
      };
    }
    const chatbotResponse = await prisma.chatbot.create({
      data: {
        sender_msg: product_name,
        receiver_msg: {
          product_name: productResponse.name,
          price: productResponse.price,
        },
      },
    });
    if (!chatbotResponse) {
      return {
        status: 0,
        message: "Product not found.",
      };
    }
    return {
      data: chatbotResponse?.receiver_msg,
    };
  } catch (error) {
    return {
      status: 0,
      message: error,
    };
  }
};
