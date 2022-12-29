import { openModal } from './modal';
import { ICard } from './type';

export class Product {
    targetProduct: ICard | undefined;
    template: HTMLDivElement;
    constructor(targetProduct: ICard | undefined) {
        this.targetProduct = targetProduct;
        this.template = document.querySelector('.product') as HTMLDivElement;
    }
    render(): void {
        if (this.targetProduct === undefined) {
            window.location.href = '/404';
        } else {
            this.template.querySelector('.product-images__main')?.setAttribute('src', this.targetProduct.images[0]);
            this.targetProduct.images.forEach((item) => {
                if (!item.includes('thumbnail')) {
                    const img = new Image();
                    img.setAttribute('src', item);
                    img.classList.add('product-images__small');
                    document.querySelector('.product-images__sub')?.append(img);
                    img.addEventListener('click', () =>
                        this.template.querySelector('.product-images__main')?.setAttribute('src', item)
                    );
                }
            });
            (this.template.querySelector('.item-categories') as HTMLElement).textContent = this.targetProduct.category;
            (this.template.querySelector('.item-brands') as HTMLElement).textContent = this.targetProduct.brand;
            (this.template.querySelector('.item-name') as HTMLElement).textContent = this.targetProduct.title;
            (this.template.querySelector('.product-info__name') as HTMLElement).textContent = this.targetProduct.title;
            (
                this.template.querySelector('.product-info__id') as HTMLElement
            ).textContent = `SKU#: ${this.targetProduct.id}`;
            (
                this.template.querySelector('.product-info__stock') as HTMLElement
            ).textContent = `In stock: ${this.targetProduct.stock}`;
            (this.template.querySelector('.product-info__description') as HTMLElement).textContent =
                this.targetProduct.description;
            (
                this.template.querySelector('.product-price__amount') as HTMLElement
            ).textContent = `$${this.targetProduct.price}`;
            (this.template.querySelector('.product-info__brand') as HTMLElement).textContent = this.targetProduct.brand;
            (this.template.querySelector('.product-info__category') as HTMLElement).textContent =
                this.targetProduct.category;
            (this.template.querySelector('.modal_container') as HTMLElement).setAttribute(
                'item',
                String(this.targetProduct.id)
            );
        }
        (document.querySelector('.modal_container') as HTMLButtonElement).addEventListener('click', () => {
            openModal();
            // const productId: string = document.querySelector('.product-info__id')?.textContent?.split(' ')[1] || '0';
            // addProductToCart(productId);
            //делать проверку на отсутствие в корзине и перенаправлять на корзину
        });
    }
}
