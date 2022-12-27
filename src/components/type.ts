export interface ICard {
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
export interface IsearchSettings {
    [key: string]: string | number | string[] | undefined;
    id?: string;
    brand?: string[];
    category?: string[];
    priceMax?: number;
    priceMin?: number;
    ratingMin?: number;
    ratingMax?: number;
    sort?: string;
    view?: string;
    search?: string;
}
export interface Icart {
    id: string;
    quantity: string;
}
