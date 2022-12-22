import { productsPage } from './cards';
import { currentSettings, setSearch } from './searchSettings';

const input = document.querySelector('.product-search__input') as HTMLInputElement;
input.onchange = (event) => {
    if (window.location.pathname === '/') {
        currentSettings.search = (event.target as HTMLInputElement).value;
        setSearch();
        productsPage.render(productsPage.filterProducts());
        console.log((event.target as HTMLInputElement).value);
    } else {
        window.location.href = `/?search=${decodeURI((event.target as HTMLInputElement).value)}`;
    }
};
