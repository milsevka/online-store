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
        } else {
            item.innerHTML = '0';
        }
    });
}
// export function counterPrice(resultArr: ICard[]) {
//     const arr = document.querySelectorAll('.span_counter-current') as unknown as NodeListOf<HTMLSpanElement>;
//     const groupByUseCase: { [key: string]: number } = {};
//     const priceArr: number[] = [];
//     resultArr.forEach((item) => {
//         priceArr.push(item.price);
//         groupByUseCase[item.price]++;
//     });
//     const max = Math.max.apply(null, priceArr);
//     const min = Math.min.apply(null, priceArr);
//     console.log(priceArr);
//     console.log(max);
//     console.log(min);
//     // const input1 = document.querySelector('.skip-value-lower') as HTMLDivElement;
//     // const input2 = document.querySelector('.skip-value-upper') as HTMLDivElement;
//     // input1.innerHTML = `${min}`;
//     // input2.innerHTML = `${max}`;
//     // const priceSlider = document.querySelector('.price-slider') as target;
//     // (priceSlider.noUiSlider as API).set([`${min}`, `${max}`]);
//     // (priceSlider.noUiSlider as API).updateOptions({
//     //     range: {
//     //         min: min,
//     //         max: max,
//     //     },
//     // });
//     // const skipValues = [input1, input2];
//     // (priceSlider.noUiSlider as API).on('update', function (values: (string | number)[], handle: number) {
//     //     skipValues[handle].innerHTML = `${values[handle]}`;
//     // });
// }
