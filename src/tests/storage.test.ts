import assert from 'assert';

import * as cart from '../components/storage';
import { Cards } from '../mock-data/data';
import { IСart } from '../components/types';

const testProd_1 = { id: '1', quantity: '1' };
const testProd_2 = { id: '2', quantity: '4' };
const markup = '<div class = "cart__quantity"></div> <div class = "cart-sum__total"></div>'; // markup to handle textContent changes made by cart funcs

describe('Cart storage', () => {
    const currentCart: IСart[] = [];
    const storage = () => JSON.parse(window.localStorage.getItem('_so-cart') as string);
    document.body.innerHTML = markup;
    describe('handles changing:', () => {
        test('adding one sample of the product', () => {
            currentCart.push(testProd_1);
            cart.addProductToCart(testProd_1.id);
            assert.deepEqual(storage(), currentCart);
        });
        test('adding the existing product', () => {
            cart.addProductToCart(testProd_1.id);
            assert.deepEqual(storage(), currentCart);
        });
        test('adding some samples of the product', () => {
            currentCart.push(testProd_2);
            cart.addProductToCart(testProd_2.id, testProd_2.quantity);
            assert.deepEqual(storage(), currentCart);
        });
        test('removing product', () => {
            currentCart.pop();
            cart.deleteProductFromCart(testProd_2.id);
            assert.deepEqual(storage(), currentCart);
        });
    });
    describe('returns', () => {
        test('right quantity of products', () => {
            assert.strictEqual(cart.prodQuantity(Number(testProd_1.id)), 1);
        });
        test('right sum of all products', () => {
            assert.strictEqual(cart.totalPrice(), Cards[0].price.toString());
        });
    });
    test('functions display correct sum at header', () => {
        const divInner = (document.querySelector('.cart-sum__total') as HTMLDivElement).textContent as string;
        assert.equal(parseInt(divInner.replace('$', '')), Cards[0].price);
    });
    test('functions display correct quantity at header', () => {
        const divInner = (document.querySelector('.cart__quantity') as HTMLDivElement).textContent as string;
        assert.equal(divInner, 1);
    });
});
