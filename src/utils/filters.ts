import { API, target } from 'nouislider';

import { productsPage } from '../components/cards';
import { currentSettings, setSearch } from '../components/searchSettings';

export function filterPrice(value: (string | number)[]): void {
    const priceMin = Number(value[0]);
    currentSettings.priceMin = priceMin;
    const priceMax = Number(value[1]);
    currentSettings.priceMax = priceMax;
    setSearch();
    productsPage.render(productsPage.filterProducts());
}

export function filterRating(value: (string | number)[]): void {
    const ratingMin = Number(value[0]);
    currentSettings.ratingMin = ratingMin;
    const ratingMax = Number(value[1]);
    currentSettings.ratingMax = ratingMax;
    setSearch();
    productsPage.render(productsPage.filterProducts());
}
export function sortAll() {
    (document.getElementById('sort') as HTMLSelectElement).addEventListener('click', () => {
        currentSettings.sort = (document.getElementById('sort') as HTMLSelectElement).value;
        setSearch();
        productsPage.render(productsPage.filterProducts());
    });
    if (typeof currentSettings['sort'] !== 'undefined' && currentSettings.sort !== 'reset') {
        (document.getElementById('sort') as HTMLSelectElement).value = currentSettings.sort;
    }
}
export function copyToClipboard(): void {
    navigator.clipboard.writeText(window.location.href);
    (document.querySelector('.copy') as HTMLButtonElement).innerHTML = 'Copied!';
    setTimeout(copy, 500);
}
function copy(): void {
    (document.querySelector('.copy') as HTMLButtonElement).innerHTML = 'Copy link';
}
export function resetFilters(): void {
    for (const key in currentSettings) {
        delete currentSettings[key];
    }
    (document.querySelector('.product-search__input') as HTMLInputElement).value = '';
    const checkedArray = document.getElementsByTagName('input');
    for (let i = 0; i < checkedArray.length; i++) {
        if (checkedArray[i].type === 'checkbox') {
            checkedArray[i].checked = false;
        }
    }
    (document.getElementById('sort') as HTMLSelectElement).value = 'reset';
    const ratingSlider = document.querySelector('.rating-slider') as target;
    const priceSlider = document.querySelector('.price-slider') as target;
    (ratingSlider.noUiSlider as API).reset();
    (priceSlider.noUiSlider as API).reset();
    (ratingSlider.noUiSlider as API).set([1.9, 4.9]);
    (priceSlider.noUiSlider as API).set([12, 1749]);
    setSearch();
    productsPage.render(productsPage.filterProducts());
}
