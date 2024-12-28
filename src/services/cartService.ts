import { prisma } from "loader/prisma";
import {
  CartlistRequestProps,
  DeleteCartRequestProps,
  UpdateCartRequestProps,
} from "types/cart";

export const cartListService = async (req: CartlistRequestProps) => {
  try {
    const { email } = req;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return {
        status: -1,
        message: "User not found.",
      };
    }

    const page = req?.page ? parseInt(req.page) : 1;
    const size = req?.size ? parseInt(req.size) : 10;

    const cartList = await prisma.addtocart.findMany({
      skip: (page - 1) * size,
      take: size,
      include: {
        products: true,
      },
    });
    const totalCount = await prisma.addtocart.count();

    return {
      status: 1,
      message: "CartData fetched successfully",
      data: {
        list: cartList,
        total_count: totalCount,
        current_page: page,
        size: size,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const updateCartService = async (req: UpdateCartRequestProps) => {
  try {
    const { email, product_id, is_cart, quantity, cart_id, actionType } = req;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return { status: -1, message: "User not found." };
    }

    if (cart_id) {
      // Check cart data available
      const isCartData = await prisma.addtocart.findUnique({
        where: {
          add_to_cart_id: cart_id,
        },
      });
      if (!isCartData) {
        throw "No Cart Data found.";
      }

      const newQuantity =
        actionType === "increment"
          ? isCartData?.quantity_count + 1
          : isCartData?.quantity_count - 1;

      if (newQuantity < 1) return { status: 0, message: "Invalid quantity." };

      const updatedCart = await prisma.addtocart.update({
        where: { add_to_cart_id: cart_id },
        data: { quantity_count: newQuantity },
        include: {
          products: true,
        },
      });

      const response = await prisma.products.update({
        where: { product_id: updatedCart?.product_id },
        data: {
          quantity_count: newQuantity,
          total_product_count:
            actionType === "increment"
              ? updatedCart?.products?.total_product_count - 1
              : updatedCart?.products?.total_product_count + 1,
        },
      });
      console.log(response);
      return {
        status: 1,
        message: `Product quantity ${actionType}ed successfully.`,
      };
    }

    // For adding new products to the cart
    const isProduct = await prisma.products.findUnique({
      where: {
        product_id,
      },
    });

    if (!isProduct) {
      return { status: 0, message: "Product not found." };
    }
    if (isProduct?.total_product_count < Number(quantity)) {
      return { status: 0, message: "Insufficient stock." };
    }

    await prisma.products.update({
      where: {
        product_id: isProduct?.product_id,
      },
      data: {
        is_cart: is_cart,
        total_product_count: isProduct?.total_product_count - Number(quantity),
      },
    });

    const response = await prisma.addtocart.create({
      data: {
        product_id: isProduct?.product_id,
        quantity_count: Number(quantity),
        price: isProduct?.price,
        strike_price: isProduct?.strike_price,
      },
      include: {
        products: true,
      },
    });
    await prisma.products.update({
      where: { product_id },
      data: {
        total_product_count: isProduct?.total_product_count - Number(quantity),
        is_cart,
      },
    });
    return {
      status: 1,
      message: "Product added to cart successfully.",
      data: { ...response },
    };
  } catch (error) {
    throw error;
  }
};

export const deleteCartService = async (req: DeleteCartRequestProps) => {
  try {
    const { email, cart_id, quantity } = req;
    console.log(cart_id);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return { status: -1, message: "User not found." };
    }

    const isExisitingProduct = await prisma.addtocart.findUnique({
      where: {
        add_to_cart_id: cart_id,
      },
      include: {
        products: true,
      },
    });

    if (!isExisitingProduct) {
      return {
        status: 0,
        message: "Product not found in cart.",
      };
    }

    await prisma.addtocart.delete({
      where: {
        add_to_cart_id: isExisitingProduct?.add_to_cart_id,
      },
    });

    const response = await prisma.products.update({
      where: {
        product_id: isExisitingProduct?.product_id,
      },
      data: {
        is_cart: false,
        quantity_count: 1,
        total_product_count:
          isExisitingProduct?.products?.total_product_count + Number(quantity),
      },
    });
    return {
      status: 1,
      message: "Product removed from cart.",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};
