import { Icart, Idiscount } from './type';
import { Cards } from './data';
import { addProductToCart, deleteProductFromCart, totalQuantity, totalPrice } from './storage';
import { openModal } from './modal';

class Cart {
    currentDiscounts: Idiscount[];
    constructor() {
        this.currentDiscounts = [];
    }
    render(cart: Icart[]): void {
        (document.querySelector('.modal_container') as HTMLButtonElement).addEventListener('click', () => {
            openModal();
        });
        this.disabledCart();
        this.calcTotal();
        const fragment = document.createDocumentFragment();
        const cartItemTemp = document.querySelector('#item') as HTMLTemplateElement;
        const container = document.querySelector('.cart-items-container') as HTMLDivElement;
        cart.forEach((item, index) => {
            const product = Cards.find((el) => el.id === Number(item.id));
            if (product) {
                const cartClone = cartItemTemp.content.cloneNode(true) as HTMLDivElement;
                (cartClone.querySelector('.cart-item__number') as HTMLDivElement).textContent = `${index + 1}`;
                (cartClone.querySelector('.cart-item__img') as HTMLImageElement).setAttribute('src', product.images[0]);
                (cartClone.querySelector('.item__name') as HTMLDivElement).textContent = product.title;
                (cartClone.querySelector('.item__stock') as HTMLDivElement).textContent = `${product.stock} in stock`;
                (cartClone.querySelector('.item-quantity__input') as HTMLInputElement).value = item.quantity;
                const totalItemPrice = cartClone.querySelector('.item-price__total') as HTMLDivElement;
                totalItemPrice.textContent = `$${product.price * Number(item.quantity)}`;
                (
                    cartClone.querySelector('.item-price__each') as HTMLDivElement
                ).textContent = `$${product.price} /Each`;
                const fullItem = cartClone.querySelector('.cart__full-item') as HTMLDivElement;
                const enlargeBtn = cartClone.querySelector('.enlarge');
                const reduceBtn = cartClone.querySelector('.reduce');
                const input = cartClone.querySelector('.item-quantity__input') as HTMLInputElement;
                const removeItem = cartClone.querySelector('.item__remove') as HTMLInputElement;
                cartClone.querySelector('.item-quantity')?.addEventListener('click', (event): void => {
                    const target = event.target as HTMLDivElement;
                    if (target === enlargeBtn) {
                        if (Number(input.value) === product.stock) {
                            null;
                        } else {
                            input.value = (Number(input.value) + 1).toString();
                            addProductToCart(item.id, input.value);
                            this.calcTotal();
                            totalItemPrice.textContent = `$${product.price * Number(input.value)}`;
                        }
                    } else if (target === reduceBtn) {
                        if (input.value === '1') {
                            input.value = (Number(input.value) - 1).toString();
                            addProductToCart(item.id, input.value);
                            this.calcTotal();
                            this.disabledCart();
                            fullItem.classList.add('cart__full-item_delete');
                            setTimeout(() => {
                                container.removeChild(fullItem);
                            }, 500);
                            totalItemPrice.textContent = `$${product.price * Number(input.value)}`;
                        } else {
                            input.value = (Number(input.value) - 1).toString();
                            addProductToCart(item.id, input.value);
                            this.calcTotal();
                            totalItemPrice.textContent = `$${product.price * Number(input.value)}`;
                        }
                    }
                });
                removeItem.addEventListener('click', (): void => {
                    deleteProductFromCart(item.id);
                    this.calcTotal();
                    fullItem.classList.add('cart__full-item_delete');
                    this.disabledCart();
                    setTimeout(() => {
                        container.removeChild(fullItem);
                        itemNumber();
                    }, 500);
                });
                fragment.append(cartClone);
            }
        });
        if (fragment.hasChildNodes()) {
            container.prepend(fragment);
        }
        document.getElementById('promo')?.addEventListener('submit', (event) => {
            event.preventDefault();
            const form = event.target as unknown as HTMLInputElement[];
            if (form[0].value === 'RS' || form[0].value === 'EPM') {
                if (!this.currentDiscounts.find((item) => item.id === form[0].value)) {
                    // if promo-code hadn't been used already
                    const discount = form[0].value === 'RS' ? 5 : 10;
                    this.currentDiscounts.push({ id: form[0].value, percentage: discount });
                    this.setPromoCode(form[0].value, discount);
                    form[0].value = '';
                    this.calcTotal();
                } else {
                    alert("Promo code can't be used twice");
                    form[0].value = '';
                }
            } else {
                form[0].value = '';
            }
        });
    }
    private calcTotal(): void {
        (document.querySelector('.cart-total__quantity-sum') as HTMLDivElement).textContent = `${totalQuantity()}`;
        (document.querySelector('.cart-total__subtotal-sum') as HTMLDivElement).textContent = `$ ${totalPrice()}`;
        const totalDiscount = this.currentDiscounts.reduce((acc, item) => acc + item.percentage, 0);
        const subtotalSum = document.querySelector('.cart-total__subtotal-sum') as HTMLDivElement;
        if (totalDiscount > 0) {
            subtotalSum.classList.add('cart-total__subtotal-sum_invalid');
        } else {
            subtotalSum.classList.remove('cart-total__subtotal-sum_invalid');
        }
        (document.querySelector('.cart-total__final-sum') as HTMLDivElement).textContent = `$ ${
            Number(totalPrice()) - (Number(totalPrice()) * totalDiscount) / 100
        }`;
    }
    private setPromoCode(value: string, discount: number): void {
        const discountFragment = document.createDocumentFragment();
        const discountTemp = document.getElementById('discountTemp') as HTMLTemplateElement;
        const subtotalBlock = document.querySelector('.cart-total__subtotal') as HTMLDivElement;
        const discountClone = discountTemp.content.cloneNode(true) as HTMLDivElement;
        const fullItem = discountClone.querySelector('.cart-total__discount') as HTMLDivElement;
        const discontCode = discountClone.querySelector('.cart-total__discount-percent') as HTMLDivElement;
        discontCode.textContent = `${value} ×`;
        discontCode.addEventListener('click', (): void => {
            (document.querySelector('.checkout__total') as HTMLDivElement).removeChild(fullItem);
            const discountIndex = this.currentDiscounts.findIndex((item) => item.id !== value);
            this.currentDiscounts.splice(discountIndex, 1);
            this.calcTotal();
        });
        (discountClone.querySelector('.cart-total__discount-sum') as HTMLDivElement).textContent = `% ${discount}`;
        discountFragment.append(discountClone);
        subtotalBlock.after(discountFragment);
    }
    private disabledCart() {
        if (Number(totalQuantity()) > 0) {
            (document.querySelector('.modal_container') as HTMLButtonElement).disabled = false;
        } else {
            (document.querySelector('.modal_container') as HTMLButtonElement).disabled = true;
        }
    }
    setPromoBlock(): void {
        this.currentDiscounts.forEach((item) => this.setPromoCode(item.id, item.percentage));
    }
}
export const cart = new Cart();

function itemNumber(): void {
    const array = document.querySelectorAll('.cart-item__number') as NodeListOf<HTMLDivElement>;
    for (let i = 0; i < array.length; i++) {
        array[i].innerHTML = `${i + 1}`;
    }
}
