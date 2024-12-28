import { prisma } from "loader/prisma";
import { CreateCategoryRequestParams } from "types/category";

export const categoryListService = async (email: string) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (email !== existingUser.email) {
      return {
        status: -1,
        message: "Invalid user",
      };
    }
    const categoryResponse = await prisma.category.findMany();

    return {
      status: 1,
      message: "All category fetched successfully",
      data: [...categoryResponse],
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const createCategoryService = async (
  req: CreateCategoryRequestParams
) => {
  try {
    const { name, email, image_url } = req;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (req.email !== existingUser.email) {
      return {
        status: -1,
        message: "Invalid user",
      };
    }
    const isExistingCategory = await prisma.category.findUnique({
      where: {
        name,
      },
    });
    if (isExistingCategory) {
      throw "Category name already exists.";
    }

    const createRes = await prisma.category.create({
      data: {
        user_id: existingUser.user_id,
        name,
        image_url,
      },
    });
    return {
      status: 1,
      message: "Category created successfully.",
      data: { ...createRes },
    };
  } catch (error) {
    throw error;
  }
};

export const deleteCategoryService = async (category_id: string) => {
  try {
    if (!category_id) {
      return { status: 0, message: "Invalid category." };
    }

    const catagory = await prisma.category.findUnique({
      where: { category_id },
    });

    if (!catagory) {
      return { status: 0, message: "Category does not exist." };
    }

    await prisma.$transaction([
      prisma.products.deleteMany({ where: { category_id } }),
      prisma.category.delete({ where: { category_id } }),
    ]);

    return { status: 1, message: "Category deleted successfully." };
  } catch (error) {
    return { status: 0, message: "An error occurred." };
  }
};
