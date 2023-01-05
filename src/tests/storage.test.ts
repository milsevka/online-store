import assert from 'assert';
import * as cart from '../components/storage';
// import { JSDOM } from 'jsdom';
import { Cards } from '../components/data';
import { Icart } from '../components/type';

describe('Cart storage', () => {
    const currentCart: Icart[] = [];
    const storage = () => JSON.parse(window.localStorage.getItem('_so-cart') as string);
    document.body.innerHTML =
        '<div class = "cart__quantity">Hello world</div><div class = "cart-sum__total">Hello world</div>';
    describe('handles changing:', () => {
        test('adding one sample of the product', () => {
            currentCart.push({ id: '1', quantity: '1' });
            cart.addProductToCart('1');
            assert.deepEqual(storage(), currentCart);
        });
        test('adding the existing product', () => {
            cart.addProductToCart('1');
            assert.deepEqual(storage(), currentCart);
        });
        test('adding some samples of the product', () => {
            currentCart.push({ id: '2', quantity: '4' });
            cart.addProductToCart('2', '4');
            assert.deepEqual(storage(), currentCart);
        });
        test('removing product', () => {
            currentCart.pop();
            cart.deleteProductFromCart('2');
            assert.deepEqual(storage(), currentCart);
        });
    });
    describe('returns', () => {
        test('right quantity of products', () => {
            assert.strictEqual(cart.prodQuantity(1), 1);
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
