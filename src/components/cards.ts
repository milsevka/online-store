import { Cards } from '../mock-data/data';

import { ICard, ISearchSettings } from './types';
import { currentSettings } from './searchSettings';
import { addProductToCart, deleteProductFromCart, prodQuantity } from './storage';
import { counterProducts } from './counter';

class Products {
    products: ICard[];
    searchSettings: ISearchSettings;
    constructor(products: ICard[], searchSettings: ISearchSettings) {
        this.products = products;
        this.searchSettings = searchSettings;
    }
    filterProducts(): ICard[] | [] {
        let resultArr = this.products.slice();
        const { brand, category, priceMax, priceMin, ratingMax, ratingMin, search, sort } = this.searchSettings;
        if (brand) {
            const subRes = resultArr.filter((item) => brand.includes(item.brand));
            resultArr = subRes;
        }
        if (category) {
            const subRes = resultArr.filter((item) => category.includes(item.category));
            resultArr = subRes;
        }
        if (priceMax) {
            const subRes = resultArr.filter((item) => item.price <= priceMax);
            resultArr = subRes;
        }
        if (priceMin) {
            const subRes = resultArr.filter((item) => item.price >= priceMin);
            resultArr = subRes;
        }
        if (ratingMax) {
            const subRes = resultArr.filter((item) => item.rating <= ratingMax);
            resultArr = subRes;
        }
        if (ratingMin) {
            const subRes = resultArr.filter((item) => item.rating >= ratingMin);
            resultArr = subRes;
        }
        if (search) {
            const subRes = resultArr.filter((item) => {
                return (
                    item.title.toLowerCase().includes(search.toString().toLowerCase()) ||
                    item.price === Number(search) ||
                    item.brand.toLowerCase().includes(search.toString().toLowerCase()) ||
                    item.category.toLowerCase().includes(search.toString().toLowerCase()) ||
                    item.stock === Number(search)
                );
            });
            resultArr = subRes;
        }
        if (sort) {
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
        counterProducts(resultArr);
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
            (cardClone.querySelector('.card__link') as HTMLDivElement).setAttribute('onclick', 'router()');
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

const productsPage = new Products(Cards, currentSettings);

export { productsPage };
