import { productsPage } from './cards';
import { counterPrice } from './counter';
import { currentSettings, setSearch } from './searchSettings';

const input = document.querySelector('.product-search__input') as HTMLInputElement;
input.onchange = (event) => {
    if (window.location.pathname === '/') {
        currentSettings.search = (event.target as HTMLInputElement).value;
        setSearch();
        counterPrice(productsPage.filterProducts());
        productsPage.render(productsPage.filterProducts());
    } else {
        window.location.href = `/?search=${decodeURI((event.target as HTMLInputElement).value)}`;
    }
};
