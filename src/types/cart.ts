export type CartlistRequestProps = {
  page: string;
  size: string;
  email: string;
};

export type CartMiddlewareProps = {
  email: string;
};

export type UpdateCartRequestProps = {
  product_id: string;
  cart_id: string;
  is_cart: boolean;
  quantity: string;
  email: string;
  actionType: "increment" | "decrement";
};

export type DeleteCartRequestProps = {
  email: string;
  cart_id: string;
  quantity: number;
};
