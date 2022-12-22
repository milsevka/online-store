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
