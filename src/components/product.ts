import { openModal } from './modal';
import { ICard } from './type';
import { link } from './router';
import { addProductToCart, deleteProductFromCart, prodQuantity } from './storage';

export class Product {
    targetProduct: ICard | undefined;
    template: HTMLDivElement;
    constructor(targetProduct: ICard | undefined) {
        this.targetProduct = targetProduct;
        this.template = document.querySelector('.product') as HTMLDivElement;
    }
    render(): void {
        if (!this.targetProduct) {
            history.pushState({}, 'newUrl', '/404');
            link();
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
            (this.template.querySelector('#addToCart') as HTMLButtonElement).addEventListener('click', async () => {
                const { id } = this.targetProduct as ICard;
                prodQuantity(id) ? deleteProductFromCart(id.toString()) : addProductToCart(id.toString());
                this.renderAddBtn();
            });
            (this.template.querySelector('.modal_container') as HTMLButtonElement).addEventListener(
                'click',
                async () => {
                    const { id } = this.targetProduct as ICard;
                    prodQuantity(id) ? null : addProductToCart(id.toString());
                    history.pushState({}, 'newUrl', '/checkout');
                    await link();
                    openModal();
                }
            );
            this.renderAddBtn();
        }
    }
    private renderAddBtn(): void {
        const addBtnTxt = this.template.querySelector('.add-btn-txt') as HTMLSpanElement;
        const { id } = this.targetProduct as ICard;
        addBtnTxt.textContent = prodQuantity(id) ? 'Remove from cart' : 'Add to cart';
    }
}
