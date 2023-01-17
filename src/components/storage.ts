import { Cards } from '../mock-data/data';

import { IСart } from './types';

function setCartQuantity(): void {
    (document.querySelector('.cart__quantity') as HTMLDivElement).textContent = `${totalQuantity()}`;
    (document.querySelector('.cart-sum__total') as HTMLDivElement).textContent = `$ ${totalPrice()}`;
}
window.onload = setCartQuantity;
function addProductToCart(id: string, quantity = '1'): void {
    if (Number(quantity) < 0) {
        alert('Incorrect number');
    } else if (Number(quantity) === 0) {
        deleteProductFromCart(id);
    } else {
        const cartStorage = getCartItems();
        const productToAssign = cartStorage.find((item) => item.id === id);
        productToAssign ? (productToAssign.quantity = quantity) : cartStorage.push({ id: id, quantity: quantity });
        localStorage.setItem('_so-cart', JSON.stringify(cartStorage));
    }
    setCartQuantity();
}
function getCartItems(): IСart[] {
    return localStorage.getItem('_so-cart') ? JSON.parse(localStorage.getItem('_so-cart') as string) : [];
}
function deleteProductFromCart(id: string): void {
    const cartStorage = getCartItems();
    const productToAssign = cartStorage.find((item) => item.id === id);
    productToAssign ? cartStorage.splice(cartStorage.indexOf(productToAssign), 1) : null;
    localStorage.setItem('_so-cart', JSON.stringify(cartStorage));
    setCartQuantity();
}

function prodQuantity(id: number): number | undefined {
    const cartStorage = getCartItems();
    const productToAssign = cartStorage.find((item) => item.id === id.toString());
    return productToAssign ? Number(productToAssign.quantity) : undefined;
}
function totalQuantity() {
    const cartStorage = getCartItems();
    return cartStorage.reduce((acc, item) => acc + Number(item.quantity), 0).toString();
}
function totalPrice(): string {
    const cartStorage = getCartItems();
    return cartStorage
        .reduce((acc, item) => {
            const product = Cards.find((el) => el.id === Number(item.id));
            if (product) {
                return product.price * Number(item.quantity) + acc;
            } else {
                return acc;
            }
        }, 0)
        .toString();
}

export { deleteProductFromCart, addProductToCart, prodQuantity, getCartItems, totalQuantity, totalPrice };
