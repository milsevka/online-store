import { productsPage, view } from './cards';
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

export function filterView() {
    if (!view) {
        const cardArr = document.querySelectorAll('.card') as NodeListOf<HTMLDivElement>;
        for (let i = 0; i < cardArr.length; i++) {
            cardArr[i].style.width = '14%';
        }
        const ratingArr = document.querySelectorAll('.card_raiting') as NodeListOf<HTMLDivElement>;
        for (let i = 0; i < ratingArr.length; i++) {
            ratingArr[i].style.display = 'none';
        }
        const stockArr = document.querySelectorAll('.card__stock') as NodeListOf<HTMLDivElement>;
        for (let i = 0; i < stockArr.length; i++) {
            stockArr[i].style.display = 'none';
        }
    }
}
