import { cart } from './checkout';
// import { setSearch } from './searchSettings';
import { getCartItems } from './storage';

export function goPagination() {
    const container = document.querySelector('.cart-items-container') as HTMLDivElement;
    container.innerHTML = '';
    const paginationInput = document.querySelector('.inputPagin') as HTMLInputElement;
    const pagination = document.querySelector('#pagination') as HTMLUListElement;
    const notesOnPage = Number(paginationInput.value);
    const countOfItems = Math.ceil(getCartItems().length / notesOnPage);
    console.log(`количество страниц ${countOfItems}`);
    console.log(`количество карточек на странице ${notesOnPage}`);
    calculatePage(1, Number(paginationInput.value));
    const items = [];
    pagination.innerHTML = '';
    for (let i = 1; i <= countOfItems; i++) {
        const li = document.createElement('li') as HTMLLIElement;
        li.innerHTML = String(i);
        pagination.appendChild(li);
        items.push(li);
    }
    for (const item of items) {
        item.addEventListener('click', function () {
            console.log(`номер станицы ${item.innerHTML}`);
            nextslide(Number(item.innerHTML));
            // item.classList.add('active');
        });
    }
}

function nextslide(item: number) {
    const container = document.querySelector('.cart-items-container') as HTMLDivElement;
    container.innerHTML = '';
    const paginationInput = document.querySelector('.inputPagin') as HTMLInputElement;
    calculatePage(item, Number(paginationInput.value));
    // setSearch();
}

export function inputPagination() {
    const paginationInput = document.querySelector('.inputPagin') as HTMLInputElement;
    paginationInput.addEventListener('input', () => {
        if (Number(paginationInput.value) > 0) {
            const container = document.querySelector('.cart-items-container') as HTMLDivElement;
            container.innerHTML = '';
            goPagination();
            // setSearch();
        }
    });
}

function calculatePage(pageNum: number, notesOnPage: number) {
    const start = (pageNum - 1) * notesOnPage;
    const end = start + notesOnPage;
    const notes = getCartItems().slice(start, end);
    cart.render(notes);
}
