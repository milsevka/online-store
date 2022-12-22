import { productsPage } from './cards';
import { currentSettings, setSearch } from './searchSettings';

export function filterPrice(value: (string | number)[], handle: number): void {
    const priceMin = Number(value[0]);
    currentSettings.priceMin = priceMin;
    const priceMax = Number(value[1]);
    currentSettings.priceMax = priceMax;
    setSearch();
    productsPage.render(productsPage.filterProducts());
}

export function filterRating(value: (string | number)[], handle: number): void {
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
    const select = (document.querySelector('#sort') as HTMLSelectElement).getElementsByTagName('option');
    for (let i = 0; i < select.length; i++) {
        if (
            typeof currentSettings['sort'] !== 'undefined' &&
            select[i].value === (document.getElementById('sort') as HTMLSelectElement).value
        )
            select[i].selected = true;
    }
}
