import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem('freshkart_cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('freshkart_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty = 1) => {
        setCartItems((prevItems) => {
            const existItem = prevItems.find((item) => item._id === product._id);

            if (existItem) {
                return prevItems.map((item) =>
                    item._id === product._id
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            } else {
                return [...prevItems, { ...product, qty }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
    };

    const updateQuantity = (id, checkQty) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item._id === id ? { ...item, qty: Number(checkQty) } : item
            )
        );
    }

    // Clear cart
    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
