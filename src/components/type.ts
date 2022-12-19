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
    brand?: string[];
    category?: string[];
    priceMax?: number;
    priceMin?: number;
    stockMin?: number;
    stockMax?: number;
    sort?: string;
    view?: string;
}
