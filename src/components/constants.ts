import { Cards } from './data';
const arrBrand: string[] = [];
const arrCategory: string[] = [];
Cards.forEach((item) => {
    arrBrand.push(item.brand);
});
Cards.forEach((item) => {
    arrCategory.push(item.category);
});

export const ALL_BRAND: string[] = Array.from(new Set(arrBrand));
export const ALL_CATEGORY: string[] = Array.from(new Set(arrCategory));
