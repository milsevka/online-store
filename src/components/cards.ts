import { ICard, IsearchSettings } from './type';
import { currentSettings, setSearch } from './searchSettings';
import { Cards } from './data';
import { default as noUiSlider, API, target } from '../../node_modules/nouislider/dist/nouislider';
import '../../node_modules/nouislider/dist/nouislider.css';
import { copyToClipboard, filterPrice, filterRating, resetFilters, sortAll } from './filters';
import { addProductToCart, deleteProductFromCart, prodQuantity } from './storage';
import { counterPrice, CounterProducts } from './counter';

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
        CounterProducts(resultArr);
        return resultArr;
    }
    render(data: ICard[]): void {
        const fragment = document.createDocumentFragment();
        const fragmentId = document.querySelector('#cards') as HTMLTemplateElement;
        (document.querySelector('.total_found') as HTMLDivElement).innerHTML = String(data.length);
        data.forEach((item) => {
            const cardClone = fragmentId.content.cloneNode(true) as HTMLElement;
            const cardImg = cardClone.querySelector('.card__img') as HTMLDivElement;
            const cardName = cardClone.querySelector('.card_name') as HTMLDivElement;
            const cardRating = cardClone.querySelector('.card_raiting') as HTMLDivElement;
            const cardStock = cardClone.querySelector('.card__stock') as HTMLDivElement;
            const cardPrice = cardClone.querySelector('.product-price__price') as HTMLSpanElement;
            const cardBuy = cardClone.querySelector('.cart-button') as HTMLButtonElement;
            cardImg.setAttribute('src', item.images[0]);
            cardName.innerHTML = item.title;
            cardRating.innerHTML = `&#9734 ${String(item.rating)}`;
            cardPrice.textContent = `$${item.price}`;
            cardStock.textContent = `${item.stock} in stock`;
            cardBuy.setAttribute('item', String(item.id));
            if (prodQuantity(item.id)) {
                cardBuy.classList.add('picked');
                (cardBuy.querySelector('img') as HTMLImageElement).setAttribute(
                    'src',
                    './assets/icons/truck-added.png'
                );
            }
            if (currentSettings.view === 'big' || typeof currentSettings.view === 'undefined') {
                (cardClone.querySelector('.card') as HTMLDivElement).classList.add('big');
                (document.querySelector('.view_small') as HTMLImageElement).style.filter = 'sepia(100)';
                (document.querySelector('.view_big') as HTMLImageElement).style.filter = 'saturate(1)';
            }
            if (currentSettings.view === 'small') {
                (document.querySelector('.view_big') as HTMLImageElement).style.filter = 'sepia(100)';
                (document.querySelector('.view_small') as HTMLImageElement).style.filter = 'saturate(1)';
                (cardClone.querySelector('.card') as HTMLDivElement).classList.add('small');
                (cardClone.querySelector('.card_raiting') as HTMLDivElement).classList.add('none');
                (cardClone.querySelector('.card__stock') as HTMLDivElement).classList.add('none');
            }
            (cardClone.querySelector('.card__link') as HTMLDivElement).setAttribute('href', `/product?id=${item.id}`);
            fragment.append(cardClone);
        });
        const cardContainer = document.querySelector('.card_container') as HTMLDivElement;
        cardContainer.innerHTML = '';
        cardContainer.append(fragment);
        if (cardContainer.innerHTML === '') {
            cardContainer.innerHTML = 'No products found';
        }
        if (currentSettings.search) {
            (document.querySelector('.product-search__input') as HTMLInputElement).value = currentSettings.search;
        }
    }
    cartListener(): void {
        const cardsBlock = document.querySelector('.card_container') as HTMLDivElement;
        cardsBlock.addEventListener('click', () => {
            const cartButton = (event?.target as HTMLElement).closest('.cart-button');
            if (cartButton) {
                const productId: string = cartButton.getAttribute('item') || '0';
                const cartPic = cartButton.querySelector('img') as HTMLImageElement;
                if (cartButton.classList.contains('picked')) {
                    cartPic.setAttribute('src', './assets/icons/truck.png');
                    deleteProductFromCart(productId);
                } else {
                    cartPic.setAttribute('src', './assets/icons/truck-added.png');
                    addProductToCart(productId);
                }
                cartButton.classList.toggle('picked');
            }
        });
    }
}

class Сategories {
    render(data: ICard[]): void {
        const fragment = document.createDocumentFragment();
        const fragmentId = document.querySelector('#filters') as HTMLTemplateElement;
        const groupByUseCase: { [key: string]: number } = {};
        data.forEach((item) => {
            if (!groupByUseCase[item.category]) {
                groupByUseCase[item.category] = 0;
            }
            groupByUseCase[item.category]++;
        });
        for (const key in groupByUseCase) {
            const cardClone = fragmentId.content.cloneNode(true) as HTMLElement;
            const inputCard = cardClone.querySelector('.input') as HTMLInputElement;
            const labelCard = cardClone.querySelector('.label') as HTMLLabelElement;
            const counterAll = cardClone.querySelector('.span_counter') as HTMLSpanElement;
            const counterCurrent = cardClone.querySelector('.span_counter-current') as HTMLSpanElement;
            if (typeof currentSettings['category'] !== 'undefined') {
                if (currentSettings.category.includes(String(key))) {
                    inputCard.checked = true;
                }
            }
            counterAll.innerHTML = String(groupByUseCase[key]);
            counterCurrent.innerHTML = String(groupByUseCase[key]);
            counterCurrent.id = key;
            inputCard.id = key;
            labelCard.setAttribute('for', `${key}`);
            labelCard.innerHTML = key;
            fragment.append(cardClone);
        }
        const cardContainer = document.querySelector('.category') as HTMLDivElement;
        cardContainer.append(fragment);
        cardContainer.addEventListener('change', (): void => {
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
                counterPrice(productsPage.filterProducts());
                productsPage.render(productsPage.filterProducts());
            } else {
                currentSettings.category = arrId;
                setSearch();
                counterPrice(productsPage.filterProducts());
                productsPage.render(productsPage.filterProducts());
            }
        });
        const title = (document.querySelectorAll('.filters_title-container') as NodeListOf<HTMLDivElement>)[0];
        title.addEventListener('click', () => {
            (title.querySelector('.filters_title-drag') as HTMLImageElement).classList.toggle(
                'filters_title-drag_active'
            );
            cardContainer.classList.toggle('spread');
        });
    }
}

class Brand {
    render(data: ICard[]): void {
        const fragment = document.createDocumentFragment();
        const fragmentId = document.querySelector('#brand') as HTMLTemplateElement;
        const groupByUseCase: { [key: string]: number } = {};
        data.forEach((item) => {
            if (!groupByUseCase[item.brand]) {
                groupByUseCase[item.brand] = 0;
            }
            groupByUseCase[item.brand]++;
        });
        for (const key in groupByUseCase) {
            const cardClone = fragmentId.content.cloneNode(true) as HTMLElement;
            const inputCard = cardClone.querySelector('.input') as HTMLInputElement;
            const labelCard = cardClone.querySelector('.label') as HTMLLabelElement;
            const counterAll = cardClone.querySelector('.span_counter') as HTMLSpanElement;
            const counterCurrent = cardClone.querySelector('.span_counter-current') as HTMLSpanElement;
            if (typeof currentSettings['brand'] !== 'undefined') {
                if (currentSettings.brand.includes(String(key))) {
                    inputCard.checked = true;
                }
            }
            counterAll.innerHTML = String(groupByUseCase[key]);
            counterCurrent.innerHTML = String(groupByUseCase[key]);
            counterCurrent.id = key;
            inputCard.id = key;
            labelCard.setAttribute('for', `${key}`);
            labelCard.innerHTML = key;
            fragment.append(cardClone);
        }
        const cardContainer = document.querySelector('.brand') as HTMLDivElement;
        cardContainer.append(fragment);
        cardContainer.addEventListener('change', (): void => {
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
                counterPrice(productsPage.filterProducts());
                productsPage.render(productsPage.filterProducts());
            } else {
                currentSettings.brand = arrBrand;
                setSearch();
                counterPrice(productsPage.filterProducts());
                productsPage.render(productsPage.filterProducts());
            }
        });
        const title = (document.querySelectorAll('.filters_title-container') as NodeListOf<HTMLDivElement>)[1];
        title.addEventListener('click', () => {
            (title.querySelector('.filters_title-drag') as HTMLImageElement).classList.toggle(
                'filters_title-drag_active'
            );
            cardContainer.classList.toggle('spread');
        });
        // price slider
        const priceSlider = document.querySelector('.price-slider') as target;
        const minPrice = currentSettings.priceMin || 0;
        const maxPrice = currentSettings.priceMax || 1749;
        noUiSlider.create(priceSlider as HTMLDivElement, {
            start: [minPrice, maxPrice],
            snap: true,
            range: {
                min: 0,
                '5%': 12,
                '6%': 13,
                '7%': 14,
                '10%': 19,
                '11%': 20,
                '13%': 30,
                '15%': 40,
                '16%': 41,
                '17%': 46,
                '18%': 51,
                '19%': 60,
                '21%': 70,
                '22%': 120,
                '25%': 280,
                '30%': 499,
                '35%': 549,
                '50%': 899,
                '55%': 1099,
                '70%': 1249,
                '85%': 1499,
                max: 1749,
            },
            // range: {
            //     min: 0,
            //     max: 1749,
            // },
            // step: 1,
            // // Handles start at ...
            // start: [minPrice, maxPrice],
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
        // counterPrice(resultArr);

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
        (document.querySelector('.view_small') as HTMLImageElement).addEventListener('click', () => {
            currentSettings.view = 'small';
            setSearch();
            productsPage.render(productsPage.filterProducts());
        });
        (document.querySelector('.view_big') as HTMLImageElement).addEventListener('click', () => {
            currentSettings.view = 'big';
            setSearch();
            productsPage.render(productsPage.filterProducts());
        });

        //sort
        sortAll();
        // copy
        (document.querySelector('.copy') as HTMLButtonElement).addEventListener('click', () => {
            copyToClipboard();
        });
        // reset
        (document.querySelector('.reset') as HTMLButtonElement).addEventListener('click', () => {
            resetFilters();
        });
    }
}
const productsPage = new Products(Cards, currentSettings);
// productsPage.render(Cards);

const categoriesPage = new Сategories();
// categoriesPage.render(Cards);

const brandPage = new Brand();
// brandPage.render(Cards);
export { categoriesPage, productsPage, brandPage };
