import { z } from "zod";

export const updateWishlistSchema = z.object({
  product_id: z.string({
    required_error: "Product id is required",
  }),
  is_wishlist: z.boolean({
    invalid_type_error: "Invalid type",
  }),
});
