import { ICard, IsearchSettings } from './type';
import { currentSettings } from './searchSettings';
import { Cards } from './data';
import { default as noUiSlider, API, target } from '../../node_modules/nouislider/dist/nouislider';
import '../../node_modules/nouislider/dist/nouislider.css';
import { filterPrice, filterRating } from './filters';

class Products {
    products: ICard[];
    searchSettings: IsearchSettings;
    constructor(products: ICard[], searchSettings: IsearchSettings) {
        this.products = products;
        this.searchSettings = searchSettings;
    }
    filterProducts(): ICard[] | [] {
        let resultArr = this.products.slice();
        if (this.searchSettings.brand) {
            const { brand } = this.searchSettings;
            const subRes = resultArr.filter((item) => brand.includes(item.brand));
            resultArr = subRes;
        }
        if (this.searchSettings.category) {
            const { category } = this.searchSettings;
            const subRes = resultArr.filter((item) => category.includes(item.category));
            resultArr = subRes;
        }
        if (this.searchSettings.priceMax) {
            const { priceMax } = this.searchSettings;
            const subRes = resultArr.filter((item) => item.price <= priceMax);
            resultArr = subRes;
        }
        if (this.searchSettings.priceMin) {
            const { priceMin } = this.searchSettings;
            const subRes = resultArr.filter((item) => item.price >= priceMin);
            resultArr = subRes;
        }
        if (this.searchSettings.ratingMax) {
            const { ratingMax } = this.searchSettings;
            const subRes = resultArr.filter((item) => item.rating <= ratingMax);
            resultArr = subRes;
        }
        if (this.searchSettings.ratingMin) {
            const { ratingMin } = this.searchSettings;
            const subRes = resultArr.filter((item) => item.rating >= ratingMin);
            resultArr = subRes;
        }
        if (this.searchSettings.sort) {
            const order = this.searchSettings.sort;
            switch (order) {
                case 'priceASC':
                    resultArr.sort((a, b) => a.price - b.price);
                    break;
                case 'priceDESC':
                    resultArr.sort((a, b) => b.price - a.price);
                    break;
                case 'ratingDESC':
                    resultArr.sort((a, b) => b.rating - a.rating);
                    break;
                case 'ratingASC':
                    resultArr.sort((a, b) => a.rating - b.rating);
                    break;
            }
        }

        return resultArr;
    }
    render(data: ICard[]): void {
        const fragment = document.createDocumentFragment();
        const fragmentId = document.querySelector('#cards') as HTMLTemplateElement;
        data.forEach((item) => {
            const cardClone = fragmentId.content.cloneNode(true) as HTMLElement;
            const cardImg = cardClone.querySelector('.card__img') as HTMLDivElement;
            const cardName = cardClone.querySelector('.card_name') as HTMLDivElement;
            const cardStock = cardClone.querySelector('.card__stock') as HTMLDivElement;
            const cardPrice = cardClone.querySelector('.product-price__price') as HTMLSpanElement;
            cardImg.setAttribute('src', item.images[0]);
            cardName.innerHTML = item.title;
            cardPrice.textContent = `$${item.price}`;
            cardStock.textContent = `${item.stock} in stock`;
            fragment.append(cardClone);
        });
        const cardContainer = document.querySelector('.card_container') as HTMLDivElement;
        cardContainer.append(fragment);
    }
}

class Сategories {
    render(data: ICard[]): void {
        const fragment = document.createDocumentFragment();
        const fragmentId = document.querySelector('#filters') as HTMLTemplateElement;
        const arr: string[] = [];
        data.forEach((item) => {
            arr.push(item.category);
        });
        const newArr: string[] = Array.from(new Set(arr));
        newArr.forEach((item) => {
            const cardClone = fragmentId.content.cloneNode(true) as HTMLElement;
            const inputCard = cardClone.querySelector('.input') as HTMLInputElement;
            const labelCard = cardClone.querySelector('.label') as HTMLLabelElement;
            inputCard.id = item;
            labelCard.setAttribute('for', `${item}`);
            labelCard.innerHTML = item;
            fragment.append(cardClone);
        });
        const cardContainer = document.querySelector('.category') as HTMLDivElement;
        cardContainer.append(fragment);
        cardContainer.addEventListener('click', (event: Event) => {
            const target = event.target as HTMLInputElement;
            history.pushState({}, 'newUrl', `?category=${target.id}`);
            const cb = [...document.querySelectorAll('input[type="checkbox"]:checked')];
            const arrId: string[] = [];
            for (let ff = 0; ff < cb.length; ff++) {
                arrId.push(cb[ff].id);
            }
            productsPage.render(Cards.filter((item) => arrId.includes(item.category)));
            console.log(Cards.filter((item) => arrId.includes(item.category)));
        });
    }
}

class Brand {
    render(data: ICard[]): void {
        const fragment = document.createDocumentFragment();
        const fragmentId = document.querySelector('#brand') as HTMLTemplateElement;
        const arr: string[] = [];
        data.forEach((item) => {
            arr.push(item.brand);
        });
        const newArr: string[] = Array.from(new Set(arr));
        newArr.forEach((item) => {
            const cardClone = fragmentId.content.cloneNode(true) as HTMLElement;
            const inputCard = cardClone.querySelector('.input') as HTMLInputElement;
            const labelCard = cardClone.querySelector('.label') as HTMLLabelElement;
            inputCard.id = item;
            labelCard.setAttribute('for', `${item}`);
            labelCard.innerHTML = item;
            fragment.append(cardClone);
        });
        const cardContainer = document.querySelector('.brand') as HTMLDivElement;
        cardContainer.append(fragment);

        // price slider
        const priceSlider = document.querySelector('.price-slider') as target;
        const minPrice = currentSettings.priceMin || 0;
        const maxPrice = currentSettings.priceMax || 1749;
        noUiSlider.create(priceSlider as HTMLDivElement, {
            range: {
                min: 0,
                max: 1749,
            },
            step: 1,
            // Handles start at ...
            start: [minPrice, maxPrice],
            connect: true,
            // Put '0' at the bottom of the slider
            direction: 'ltr',
            orientation: 'horizontal',
            // Move handle on tap, bars are draggable
            behaviour: 'tap-drag',
            tooltips: true,
        });
        (priceSlider.noUiSlider as API).on('change', filterPrice);

        // stock slider
        const ratingSlider = document.querySelector('.rating-slider') as target;
        const minRating = currentSettings.ratingMin || 0;
        const maxRating = currentSettings.ratingMax || 5;
        noUiSlider.create(ratingSlider as HTMLDivElement, {
            range: {
                min: 0,
                max: 5,
            },
            step: 0.1,
            // Handles start at ...
            start: [minRating, maxRating],
            connect: true,
            // Put '0' at the bottom of the slider
            direction: 'ltr',
            orientation: 'horizontal',
            // Move handle on tap, bars are draggable
            behaviour: 'tap-drag',
            tooltips: true,
        });
        (ratingSlider.noUiSlider as API).on('change', filterRating);
    }
}
const productsPage = new Products(Cards, currentSettings);
// productsPage.render(Cards);

const categoriesPage = new Сategories();
// categoriesPage.render(Cards);

const brandPage = new Brand();
// brandPage.render(Cards);
export { categoriesPage, productsPage, brandPage };
