import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(3, "category name must be greater than 3 characters."),
  image_url: z
    .string()
    // .regex(
    //   /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp|svg))$/i,
    //   "Invalid image url."
    // ),
});
