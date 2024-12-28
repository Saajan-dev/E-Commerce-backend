export type GetWishlistRequestProps = {
  page: string;
  size: string;
  email: string;
};

export type UpdateWisthlistRequestProps = {
  product_id: string;
  wishlist_id: string;
  is_wishlist: boolean;
  email: string;
};
