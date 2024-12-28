import { prisma } from "loader/prisma";
import { ProductListProps } from "types/product";

const productListService = async (req: ProductListProps) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: req.email,
      },
    });

    if (!existingUser) {
      return {
        status: -1,
        message: "User not found.",
      };
    }

    if (req.product_id) {
      const spottedProduct = await prisma.products.findFirst({
        where: {
          product_id: req.product_id,
        },
      });
      if (spottedProduct) {
        return {
          status: 1,
          message: "Product retrived successfully!",
          data: { ...spottedProduct },
        };
      } else {
        return {
          status: 0,
          message: "Invalid product",
        };
      }
    }
    const page = req?.page ? parseInt(req.page) : 1;
    const size = req?.size ? parseInt(req.size) : 10;

    const productsList = await prisma.products.findMany({
      skip: (page - 1) * size,
      take: size,
      include: {
        category: true,
      },
    });
    const totalCount = await prisma.products.count();

    return {
      status: 1,
      message: "Products fetched successfully",
      data: {
        list: productsList,
        total_count: totalCount,
        current_page: page,
        size: size,
      },
    };
  } catch (error) {
    throw error;
  }
};

const deleteProductService = async (product_id: string) => {
  try {
    if (!product_id) {
      return { status: 0, message: "Invalid product." };
    }

    const product = await prisma.products.findUnique({
      where: { product_id },
    });

    if (!product) {
      return { status: 0, message: "Product does not exist." };
    }

    await prisma.$transaction([
      prisma.wishlists.deleteMany({ where: { product_id } }),
      prisma.addtocart.deleteMany({ where: { product_id } }),
      prisma.products.delete({ where: { product_id } }),
    ]);

    return { status: 1, message: "Product deleted successfully." };
  } catch (error) {
    return { status: 0, message: "An error occurred." };
  }
};

const createProductService = async (reqData: any) => {
  try {
    const { category_id, email, ...restdata } = reqData;
    const isExisitingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!isExisitingUser) {
      return {
        status: -1,
        message: "User not found",
      };
    }

    const isExistingCategory = await prisma.category.findUnique({
      where: {
        category_id,
      },
    });
    if (!isExistingCategory) {
      throw "Category not found.";
    }

    const isExistingProduct = await prisma.products.findUnique({
      where: {
        name: restdata?.name,
      },
    });

    if (isExistingProduct) {
      throw "This product name is already exists.";
    }

    const createProduct = await prisma.products.create({
      data: {
        category_id: isExistingCategory?.category_id,
        quantity_count: 1,
        ...restdata,
      },
    });

    return {
      status: 1,
      message: "Product Created successfully.",
      data: { ...createProduct },
    };
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export default {
  createProductService,
  productListService,
  deleteProductService,
};
