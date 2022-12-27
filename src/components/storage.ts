import { Icart } from './type';

function addProductToCart(id: string, quantity = '1'): void {
    if (Number(quantity) < 0) {
        alert('Incorrect number');
    } else if (Number(quantity) === 0) {
        deleteProductFromCart(id);
    } else {
        const cartStorage: Icart[] = localStorage.getItem('_so-cart')
            ? JSON.parse(localStorage.getItem('_so-cart') as string)
            : [];
        const productToAssign = cartStorage.find((item) => item.id === id);
        productToAssign ? (productToAssign.quantity = quantity) : cartStorage.push({ id: id, quantity: quantity });
        localStorage.setItem('_so-cart', JSON.stringify(cartStorage));
    }
}

function deleteProductFromCart(id: string): void {
    const cartStorage: Icart[] = localStorage.getItem('_so-cart')
        ? JSON.parse(localStorage.getItem('_so-cart') as string)
        : [];
    const productToAssign = cartStorage.find((item) => item.id === id);
    productToAssign ? cartStorage.splice(cartStorage.indexOf(productToAssign), 1) : null;
    localStorage.setItem('_so-cart', JSON.stringify(cartStorage));
}

function prodQuantity(id: number): number | undefined {
    const cartStorage: Icart[] = localStorage.getItem('_so-cart')
        ? JSON.parse(localStorage.getItem('_so-cart') as string)
        : [];
    const productToAssign = cartStorage.find((item) => item.id === id.toString());
    return productToAssign ? Number(productToAssign.quantity) : undefined;
}
export { deleteProductFromCart, addProductToCart, prodQuantity };
