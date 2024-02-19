import { createContext } from "react";
// below use component naming approach because createContext() return the object that is component.

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});
