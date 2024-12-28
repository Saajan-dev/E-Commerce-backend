import { prisma } from "loader/prisma";

export const createOrderService = async (data: any) => {
  try {
    const { email, order_data, total_price, status } = data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const productDetails = await Promise.all(
      order_data.map(async (order) => {
        const product = await prisma.products.findUnique({
          where: { product_id: order.product_id },
          include: { category: true },
        });

        if (!product) {
          throw new Error(`Product with ID ${order.product_id} not found.`);
        }

        if (product.total_product_count < order.order_count) {
          throw new Error(
            `Not enough stock for product: ${product.name}. Available: ${product.total_product_count}`
          );
        }

        return {
          ...product,
          order_count: order.order_count,
        };
      })
    );
    console.log(productDetails, "PRODUCT DETAILS");

    await Promise.all(
      productDetails.map(async (product) => {
        await prisma.orders.create({
          data: {
            category_id: product?.category?.category_id,
            product_id: product?.product_id,
            product_name: product?.name,
            image_url: product?.image_url,
            description: product?.description,
            price: product?.price,
            strike_price: product?.strike_price,
            order_count: product?.order_count,
            total_price,
            status,
          },
        });

        await prisma.addtocart.delete({
          where: { product_id: product?.product_id },
        });

        await prisma.products.update({
          where: { product_id: product?.product_id },
          data: {
            is_cart: false,
            quantity_count: 1,
          },
        });
      })
    );

    return {
      status: 1,
      message: "Orders have been placed successfully.",
    };
  } catch (error) {
    console.error("Error in createOrderService:", error);
    throw error;
  }
};

export const getAllOrderService = async (email: string) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const getAllOrders = await prisma.orders.findMany();
    return {
      status: 1,
      message: "Order details fetched successfully.",
      data: getAllOrders,
    };
  } catch (error) {
    throw error;
  }
};
