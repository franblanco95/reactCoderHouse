import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartComponentContext = ({ children }) => {

    const [carrito, setCarrito] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)

    const vaciarCarrito = () => {
        setCarrito([]);
        getTotalPrice(0);
    }

    //Controla si el elemento ya esta en el carrito
    const isInCart = (id) => carrito.some(product => product.id === id)

    const addItem = ({ product }, quantity) => {
        if (isInCart(product.id)) {
            const newCart = carrito.map(cartElement => {
                if (cartElement.id === product.id) {
                    return { ...cartElement, quantity: cartElement.quantity + quantity }
                } else return cartElement;
            })
            setCarrito(newCart);
        } else {
            setCarrito(prev => [...prev, { ...product, quantity }]);
        }
        getTotalPrice()
    }

    const removeItem = (index) => {
        let updatedCart = carrito;
        updatedCart.splice(index, 1);
        setCarrito(updatedCart);
        getTotalPrice()
    }

    const getTotalPrice = () => {
        let total = carrito.reduce((acc, cur) => {
            return (cur.price * cur.quantity) + acc
        }, 0);
        // el 0 es el primer valor que le damos a la variable acc
        setTotalPrice(total);
    }

    useEffect(() => {
        const localCart = localStorage.getItem('carrito');
        if (!localCart) localStorage.setItem('carrito', JSON.stringify([]));
        else setCarrito(JSON.parse(localCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }, [carrito])

    return (
        <CartContext.Provider value={{ addItem, carrito, setCarrito, vaciarCarrito, removeItem, totalPrice }}>
            {children}
        </CartContext.Provider>
    )
}