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
    ratingMin?: number;
    ratingMax?: number;
    sort?: string;
    view?: string;
}
export const ALL_BRAND = [
    'Apple',
    'Samsung',
    'OPPO',
    'Huawei',
    'Microsoft Surface',
    'Infinix',
    'HP Pavilion',
    'Impression of Acqua',
    'Royal_Mirage',
    'Fog Scent Xpressio',
    'Al Munakh',
    'Lord - Al-Rehab',
    "L'Oreal Paris",
    'Hemani Tea',
    'Dermive',
    'ROREC White Rice',
    'Fair & Clear',
    'Saaf & Khaas',
    'Bake Parlor Big',
    'Baking Food Items',
    'fauji',
    'Dry Rose',
    'Boho Decor',
    'Flying Wooden',
    'LED Lights',
    'luxury palace',
    'Golden',
];
export const ALL_CATEGORY = ['smartphones', 'laptops', 'fragrances', 'skincare', 'groceries', 'home-decoration'];
