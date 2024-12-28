import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(4, "Product name must be greater than 4 characters."),
  image_url: z
    .array(
      z.string({
        invalid_type_error: "Image URL must be in string.",
      }),

      {
        required_error: "Image URLs are required.",
      }
    )
    .min(3, "Minimum 3 image needed."),
  description: z
    .array(
      z.string({
        invalid_type_error: "Each description point must be a string.",
      }),
      { required_error: "Description is a required field." }
    )
    .min(3, "Minimum 3 points needed."),
  price: z.number({
    required_error: "Price is required.",
    invalid_type_error: "Price value must be in number.",
  }),
  strike_price: z.number({
    required_error: "Strike Price is required.",
    invalid_type_error: "Strike Price value must be in number.",
  }),
  discount: z.number().optional(),
  total_product_count: z.number({
    required_error: "Product Count is required.",
    invalid_type_error: "Product Count value must be in number.",
  }),
});
//   .refine((data) => data.strike_price > data.price, {
//     message: "Strike price must be greater than the price.",
//     path: ["strike_price"],
//   });
