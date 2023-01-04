import assert from 'assert';
import { currentSettings } from '../components/searchSettings';
import { productsPage } from '../components/cards';
import {JSDOM} from 'jsdom';
// const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
// console.log(dom.window.document.querySelector("p").textContent);

describe('Filtering products', () => {
    describe('supports')
    beforeEach(() => {
        for (const key in currentSettings) {
            delete currentSettings[key];
        }
    })
    it('category', () => {
        currentSettings.category=['Smartphones']
        assert.deepEqual(productsPage.filterProducts().length, 5)

    });
    it('category', () => {
        currentSettings.category=['Laptops']
        assert.deepEqual(productsPage.filterProducts().length, 5)

    });
    it('category', () => {
        currentSettings.category=['Smartphones']
        console.log(productsPage.filterProducts().length)

    });
})
