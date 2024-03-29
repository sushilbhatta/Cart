import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";
// below use component naming approach because createContext() return the object that is component.

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});

function shoppingCartReducer(state, action) {
  if (action.type === "ADD-ITEM") {
    //get the latest items that the user updated eg if user add the item to cart
    const updatedItems = [...state.items]; //array distructhuring
    // chek if item already exist on the cart.
    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    );
    // get the existing cart item if it exist
    const existingCartItem = updatedItems[existingCartItemIndex];
    //if item exist update its quantity
    if (existingCartItem) {
      const updatedItems = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItems;
    } else {
      // if item doesnot exist , find it from database
      const product = DUMMY_PRODUCTS.find((product) => {
        return product.id === action.payload;
      });
      // if the product is found in database update its quantity
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }
    // return the updated cart state.
    return {
      ...state, //this is not needed here as we have only one value.
      items: updatedItems,
    };
  }
  if (action.type === "UPDATE-ITEM") {
    // Create the copy of the items array to avoid modifying the previous state directly
    const updatedItems = [...state.items];
    // find the index of the item in the array that maches the ProductId
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );
    //  create a copy of the the found  item to avoid modifying the orginal item directly
    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };
    // update the  quantity
    updatedItem.quantity = updatedItem.quantity + action.payload.amount;
    // check of updated item is 0 or less
    if (updatedItem.quantity <= 0) {
      // if true  remove the item from the array
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      // else  update the item in the array
      updatedItems[updatedItemIndex] = updatedItem;
    }
    return {
      ...state,
      items: updatedItems,
    };
  }
  return state;
}
//dispatch is the process of dending information to the destination

export default function CartContextProvider({ children }) {
  //managing the state using the useReducer hooks
  const [shopingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    { items: [] }
  );

  // //create a shoping cart state to handle the added items
  // const [shopingCart, setShopingCart] = useState({ items: [] });
  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: "ADD-ITEM",
      payload: id,
    });
  }
  // function to handle updating the specific quantity  items in shoping cart
  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE-ITEM",
      payload: {
        productId,
        amount,
      },
    });
  }
  const ctxValue = {
    items: shopingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };
  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}
