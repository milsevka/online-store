import { ICard, IsearchSettings } from './type';
import { currentSettings, setSearch } from './searchSettings';
import { Cards } from './data';
import { default as noUiSlider, API, target } from '../../node_modules/nouislider/dist/nouislider';
import '../../node_modules/nouislider/dist/nouislider.css';
import { filterPrice, filterRating, sortAll } from './filters';
import e from 'express';

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
        if (this.searchSettings.search) {
            const { search } = this.searchSettings;
            const subRes = resultArr.filter((item) => {
                return (
                    item.title.toLowerCase().includes(search.toString().toLowerCase()) ||
                    item.price === Number(search) ||
                    item.brand.toLowerCase().includes(search.toString().toLowerCase()) ||
                    item.category.toLowerCase().includes(search.toString().toLowerCase()) ||
                    item.stock === Number(search)
                );
            });
            // debugger;
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
                default:
                    return resultArr;
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
            const cardRating = cardClone.querySelector('.card_raiting') as HTMLDivElement;
            const cardStock = cardClone.querySelector('.card__stock') as HTMLDivElement;
            const cardPrice = cardClone.querySelector('.product-price__price') as HTMLSpanElement;
            cardImg.setAttribute('src', item.images[0]);
            cardName.innerHTML = item.title;
            cardRating.innerHTML = `&#9734 ${String(item.rating)}`;
            cardPrice.textContent = `$${item.price}`;
            cardStock.textContent = `${item.stock} in stock`;
            if (currentSettings.view === 'big') {
                (cardClone.querySelector('.card') as HTMLDivElement).classList.add('big');
            }
            if (currentSettings.view === 'small') {
                (cardClone.querySelector('.card') as HTMLDivElement).classList.add('small');
                (cardClone.querySelector('.card_raiting') as HTMLDivElement).classList.add('none');
                (cardClone.querySelector('.card__stock') as HTMLDivElement).classList.add('none');
            }
            fragment.append(cardClone);
        });
        const cardContainer = document.querySelector('.card_container') as HTMLDivElement;
        cardContainer.innerHTML = '';
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
            if (typeof currentSettings['category'] !== 'undefined') {
                if (currentSettings.category.includes(String(item))) {
                    inputCard.checked = true;
                }
            }
            inputCard.id = item;
            labelCard.setAttribute('for', `${item}`);
            labelCard.innerHTML = item;
            fragment.append(cardClone);
        });
        const cardContainer = document.querySelector('.category') as HTMLDivElement;
        cardContainer.append(fragment);
        cardContainer.addEventListener('change', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const checkedArray = [
                ...(document.querySelector('.category') as HTMLDivElement).querySelectorAll(
                    'input[type="checkbox"]:checked'
                ),
            ];
            const arrId: string[] = [];
            for (let i = 0; i < checkedArray.length; i++) {
                arrId.push(checkedArray[i].id);
            }
            if (arrId.length === 0) {
                delete currentSettings.category;
                setSearch();
                productsPage.render(productsPage.filterProducts());
            } else {
                currentSettings.category = arrId;
                setSearch();
                productsPage.render(productsPage.filterProducts());
            }
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
            if (typeof currentSettings['brand'] !== 'undefined') {
                if (currentSettings.brand.includes(String(item))) {
                    inputCard.checked = true;
                }
            }
            inputCard.id = item;
            labelCard.setAttribute('for', `${item}`);
            labelCard.innerHTML = item;
            fragment.append(cardClone);
        });
        const cardContainer = document.querySelector('.brand') as HTMLDivElement;
        cardContainer.append(fragment);
        cardContainer.addEventListener('change', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const checkedArray = [
                ...(document.querySelector('.brand') as HTMLDivElement).querySelectorAll(
                    'input[type="checkbox"]:checked'
                ),
            ];
            const arrBrand: string[] = [];
            for (let i = 0; i < checkedArray.length; i++) {
                arrBrand.push(checkedArray[i].id);
            }
            if (arrBrand.length === 0) {
                delete currentSettings.brand;
                setSearch();
                productsPage.render(productsPage.filterProducts());
            } else {
                currentSettings.brand = arrBrand;
                setSearch();
                productsPage.render(productsPage.filterProducts());
            }
        });

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
            // snap: true,
            //connect: true,
            // // Put '0' at the bottom of the slider
            // direction: 'ltr',
            // orientation: 'horizontal',
            // // Move handle on tap, bars are draggable
            // behaviour: 'tap-drag',
            // tooltips: true,
        });
        const input1 = document.createElement('div') as HTMLDivElement;
        input1.className = 'skip-value-lower';
        const input2 = document.createElement('div') as HTMLDivElement;
        input2.className = 'skip-value-upper';
        (document.querySelector('.price_title') as HTMLDivElement).append(input1);
        (document.querySelector('.price_title') as HTMLDivElement).append(input2);
        const skipValues = [input1, input2];
        (priceSlider.noUiSlider as API).on('update', function (values: (string | number)[], handle: number) {
            skipValues[handle].innerHTML = `${values[handle]}`;
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
            // snap: true,
            // connect: true,
            // // Put '0' at the bottom of the slider
            // direction: 'ltr',
            // orientation: 'horizontal',
            // // Move handle on tap, bars are draggable
            // behaviour: 'tap-drag',
            // tooltips: true,
        });
        const input3 = document.createElement('div') as HTMLDivElement;
        input1.className = 'skip-value-lower-rating';
        const input4 = document.createElement('div') as HTMLDivElement;
        input2.className = 'skip-value-upper-rating';
        (document.querySelector('.rating_title') as HTMLDivElement).append(input3);
        (document.querySelector('.rating_title') as HTMLDivElement).append(input4);
        const skipValuesRating = [input3, input4];
        (ratingSlider.noUiSlider as API).on('update', function (values: (string | number)[], handle: number) {
            skipValuesRating[handle].innerHTML = `${values[handle]}`;
        });
        (ratingSlider.noUiSlider as API).on('change', filterRating);

        //view
        (document.querySelector('.view_small') as HTMLDivElement).addEventListener('click', () => {
            currentSettings.view = 'small';
            setSearch();
            productsPage.render(productsPage.filterProducts());
        });
        (document.querySelector('.view_big') as HTMLDivElement).addEventListener('click', () => {
            currentSettings.view = 'big';
            setSearch();
            productsPage.render(productsPage.filterProducts());
        });

        //sort
        sortAll();
    }
}
const productsPage = new Products(Cards, currentSettings);
// productsPage.render(Cards);

const categoriesPage = new Сategories();
// categoriesPage.render(Cards);

const brandPage = new Brand();
// brandPage.render(Cards);
export { categoriesPage, productsPage, brandPage };
