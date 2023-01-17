import { ICard } from './types';
import { currentSettings, setSearch } from './searchSettings';
import { counterPrice } from './counter';
import { productsPage } from './cards';

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
export const categoriesPage = new Сategories();
