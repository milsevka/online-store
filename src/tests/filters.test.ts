import assert from 'assert';
import { currentSettings } from '../components/searchSettings';
import { productsPage } from '../components/cards';
import { Cards } from '../mock-data/data';

describe('Filtering products func returns right quantity when', () => {
    it('there is no search params', () => {
        assert.deepEqual(productsPage.filterProducts().length, 30);
    });
    describe('passing', () => {
        beforeEach(() => {
            for (const key in currentSettings) {
                delete currentSettings[key];
            }
        });
        it('one category', () => {
            currentSettings.category = ['Smartphones'];
            assert.deepEqual(productsPage.filterProducts().length, 5);
        });
        it('some categories', () => {
            currentSettings.category = ['Smartphones', 'Laptops', 'Fragrances'];
            assert.deepEqual(productsPage.filterProducts().length, 15);
        });
        it('one category and some brands ', () => {
            currentSettings.category = ['Smartphones'];
            currentSettings.brand = ['Apple', 'OPPO'];
            assert.deepEqual(productsPage.filterProducts().length, 3);
        });
        it('price-desc sort order', () => {
            currentSettings.sort = 'priceDESC';
            const sorted = Cards.sort((a, b) => b.price - a.price);
            assert.deepEqual(productsPage.filterProducts(), sorted);
        });
        it('unsupported parameter', () => {
            currentSettings.unsupported = 123;
            assert.deepEqual(productsPage.filterProducts(), Cards);
        });
    });
});
