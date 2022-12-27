import { categoriesPage, productsPage, brandPage } from './cards';
import { counterPrice, CounterProducts } from './counter';
import { Cards } from './data';
import { Product } from './product';
import { currentSettings, settingsObjCreate } from './searchSettings';

const root = document.querySelector('.root') as HTMLDivElement;

const routes: { [pathname: string]: string } = {
    '/': './pages/main.html', //./pages/main.html
    '/404': './pages/404.html',
    '/product': './pages/product.html',
    '/checkout': './pages/cart.html',
};

window.onpopstate = link;
Object.defineProperty(window, 'router', router);
window.addEventListener('DOMContentLoaded', link);
link();

export function router(event: MouseEvent) {
    event = event || window.event; // as i understand this magic needs when no arg is passing in html: onclick="router(event)"
    event.preventDefault();
    console.log(event);
    history.pushState({}, 'newUrl', (event.target as HTMLLinkElement).href);
    link();
}

async function link() {
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
        CounterProducts(productsPage.filterProducts());
        counterPrice(productsPage.filterProducts());
    }
    if (route === routes['/product']) {
        const currentProduct = Cards.find((item) => item.id === Number(currentSettings.id));
        const pickedProduct = new Product(currentProduct);
        pickedProduct.render();
    }
}
