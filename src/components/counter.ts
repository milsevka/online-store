import { API, target } from 'nouislider';
import { ICard } from './type';

export function CounterProducts(resultArr: ICard[]) {
    const arr = document.querySelectorAll('.span_counter-current') as unknown as NodeListOf<HTMLSpanElement>;
    const groupByUseCase: { [key: string]: number } = {};
    const priceArr: number[] = [];
    resultArr.forEach((item) => {
        if (!groupByUseCase[item.category]) {
            groupByUseCase[item.category] = 0;
        }
        if (!groupByUseCase[item.brand]) {
            groupByUseCase[item.brand] = 0;
        }
        if (!groupByUseCase[item.price]) {
            groupByUseCase[item.price] = 0;
        }
        priceArr.push(item.price);
        groupByUseCase[item.category]++;
        groupByUseCase[item.brand]++;
        groupByUseCase[item.price]++;
    });
    arr.forEach((item) => {
        if (Object.keys(groupByUseCase).includes(item.id)) {
            item.innerHTML = `${groupByUseCase[item.id]}`;
            (item.closest('#counter') as HTMLDivElement).style.color = 'black';
        } else {
            item.innerHTML = '0';
            (item.closest('#counter') as HTMLDivElement).style.color = 'gray';
        }
    });
}
export function counterPrice(resultArr: ICard[]) {
    const groupByUseCase: { [key: string]: number } = {};
    const priceArr: number[] = [];
    const ratingArr: number[] = [];
    resultArr.forEach((item) => {
        priceArr.push(item.price);
        ratingArr.push(item.rating);
        groupByUseCase[item.price]++;
        groupByUseCase[item.rating]++;
    });
    const maxPrice = Math.max.apply(null, priceArr);
    const minPrice = Math.min.apply(null, priceArr);
    const maxRating = Math.max.apply(null, ratingArr);
    const minRating = Math.min.apply(null, ratingArr);
    const priceSlider = document.querySelector('.price-slider') as target;
    const ratingSlider = document.querySelector('.rating-slider') as target;
    (priceSlider.noUiSlider as API).set([`${minPrice}`, `${maxPrice}`]);
    (ratingSlider.noUiSlider as API).set([`${minRating}`, `${maxRating}`]);
}
