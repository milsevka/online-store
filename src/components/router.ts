import { Cards } from '../mock-data/data';

import { productsPage } from './cards';
import { categoriesPage } from './caregories';
import { brandPage } from './brands';
import { counterPrice, counterProducts } from './counter';
import { Product } from './product';
import { currentSettings, settingsObjCreate } from './searchSettings';
import { cart } from './checkout';
import { getCartItems } from './storage';

const root = document.querySelector('.root') as HTMLDivElement;

const routes: { [pathname: string]: string } = {
    '/': './pages/main.html',
    '/404': './pages/404.html',
    '/product': './pages/product.html',
    '/checkout': './pages/cart.html',
};

window.onpopstate = link;
Object.defineProperty(window, 'router', { value: router });
window.addEventListener('DOMContentLoaded', link);
link();

function router(event: MouseEvent) {
    event = event || window.event; // this magic needs when no arg is passing in html: onclick="router(event)"
    event.preventDefault();
    history.pushState({}, 'newUrl', (event.currentTarget as HTMLLinkElement).href);
    link();
}

export async function link() {
    for (const key in currentSettings) {
        delete currentSettings[key];
    }
    Object.assign(currentSettings, settingsObjCreate(window.location.search));
    const route = routes[window.location.pathname] || routes['/404'];
    const template = await fetch(route).then((data) => data.text());
    root.innerHTML = template;
    if (route === routes['/']) {
        categoriesPage.render(Cards);
        productsPage.render(productsPage.filterProducts());
        productsPage.cartListener();
        brandPage.render(Cards);
        counterProducts(productsPage.filterProducts());
        counterPrice(productsPage.filterProducts());
    }
    if (route === routes['/product']) {
        const currentProduct = Cards.find((item) => item.id === Number(currentSettings.id));
        if (currentProduct) new Product(currentProduct).render();
    }
    if (route === routes['/checkout']) {
        cart.render(getCartItems());
        cart.setPromoBlock();
    }
}
