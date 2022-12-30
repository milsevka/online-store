import { Icart } from './type';
import { Cards } from './data';

function setCartQuantity() {
    (document.querySelector('.cart__quantity') as HTMLDivElement).textContent = `${totalQuantity()}`;
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
function getCartItems(): Icart[] {
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
function totalPrice() {
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

function disabledCart() {
    if (Number(totalQuantity()) > 0) {
        (document.querySelector('.modal_container') as HTMLButtonElement).disabled = false;
    } else {
        (document.querySelector('.modal_container') as HTMLButtonElement).disabled = true;
    }
}
export { deleteProductFromCart, addProductToCart, prodQuantity, getCartItems, totalQuantity, totalPrice, disabledCart };
