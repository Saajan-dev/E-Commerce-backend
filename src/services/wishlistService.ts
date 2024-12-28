import { prisma } from "loader/prisma";
import {
  GetWishlistRequestProps,
  UpdateWisthlistRequestProps,
} from "types/wishlist";

export const wishlistService = async (req: GetWishlistRequestProps) => {
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

    const wishlistsList = await prisma.wishlists.findMany({
      skip: (page - 1) * size,
      take: size,
      include: {
        products: true,
      },
    });
    const totalCount = await prisma.wishlists.count();

    return {
      status: 1,
      message: "Wishlist fetched successfully",
      data: {
        list: wishlistsList,
        total_count: totalCount,
        current_page: page,
        size: size,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const updateWishlistService = async (
  req: UpdateWisthlistRequestProps
) => {
  try {
    const { email, product_id, is_wishlist, wishlist_id } = req;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return {
        status: 0,
        message: "User not found.",
      };
    }
    const existingProduct = await prisma.products.findUnique({
      where: {
        product_id,
      },
    });

    if (!existingProduct) {
      return {
        status: 0,
        message: "Product not found.",
      };
    }

    if (wishlist_id) {
      const isWishlistProduct = await prisma.wishlists.findUnique({
        where: {
          wishlist_id,
        },
      });

      if (!isWishlistProduct) {
        throw "No product found.";
      }

      await prisma.wishlists.delete({
        where: {
          wishlist_id,
        },
      });

      await prisma.products.update({
        where: {
          product_id: existingProduct?.product_id,
        },
        data: {
          is_whislist: false,
        },
      });

      return {
        status: 1,
        message: "Product removed from wishlists.",
      };
    } else {
      if (is_wishlist === true) {
        await prisma.wishlists.create({
          data: {
            product_id,
          },
        }),
          await prisma.products.update({
            where: {
              product_id,
            },
            data: {
              is_whislist: true,
            },
          });

        return {
          status: 1,
          message: "Product added to wishlist successfully.",
        };
      } else if (is_wishlist === false) {
        await prisma.wishlists.delete({
          where: {
            product_id,
          },
        }),
          await prisma.products.update({
            where: {
              product_id,
            },
            data: {
              is_whislist: false,
            },
          });
        return {
          status: 1,
          message: "Product removed from wishlist successfully.",
        };
      }
    }
  } catch (error) {
    throw error;
  }
};
