import { Cards } from '../data';

interface ICard {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

class Products {
    render(data: ICard[]) {
        const fragment = document.createDocumentFragment();
        const fragmentId = document.querySelector('#cards') as HTMLTemplateElement;
        data.forEach((item) => {
            const cardClone = fragmentId.content.cloneNode(true) as HTMLElement;
            const cardImg = cardClone.querySelector('.card') as HTMLDivElement;
            const cardName = cardClone.querySelector('.card_name') as HTMLDivElement;
            const cardCategory = cardClone.querySelector('.card_category') as HTMLDivElement;
            const cardBrand = cardClone.querySelector('.card_brand') as HTMLDivElement;
            const cardPrice = cardClone.querySelector('.card_price') as HTMLDivElement;
            cardImg.style.background = `url(${item.images[0]})`;
            cardImg.style.backgroundSize = 'cover';
            cardName.innerHTML = item.title;
            cardCategory.innerHTML = `Category: ${item.category}`;
            cardBrand.innerHTML = `Brand: ${item.brand}`;
            cardPrice.innerHTML = `Price: ${item.price}`;
            fragment.append(cardClone);
        });
        const cardContainer = document.querySelector('.card_container') as HTMLDivElement;
        cardContainer.append(fragment);
    }
}

class Сategories {
    render(data: ICard[]) {
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
    }
}

class Brand {
    render(data: ICard[]) {
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
    }
}

const productsPage = new Products();
productsPage.render(Cards);

const categoriesPage = new Сategories();
categoriesPage.render(Cards);

const brandPage = new Brand();
brandPage.render(Cards);
