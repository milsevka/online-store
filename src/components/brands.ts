import { default as noUiSlider, API, target } from 'nouislider';

import { copyToClipboard, filterPrice, filterRating, resetFilters, sortAll } from '../utils/filters';

import { ICard } from './types';
import { currentSettings, setSearch } from './searchSettings';
import { counterPrice } from './counter';
import { productsPage } from './cards';

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
            range: {
                min: 0,
                max: 1749,
            },
            step: 1,
            // Handles start at ...
            start: [minPrice, maxPrice],
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

export const brandPage = new Brand();
