const root = document.querySelector('.root') as HTMLDivElement;

const routes: { [pathname: string]: string } = {
    '/main': './pages/main.html', //./pages/main.html
    '404': './pages/404.html',
};
function router(event: MouseEvent) {
    event = event || window.event; // as i understand this magic needs when no arg is passing in html: onclick="router(event)"
    event.preventDefault();
    history.pushState({}, 'newUrl', (event.target as HTMLLinkElement).href);
    link();
}
window.onpopstate = link;
window.router = router;
// window.addEventListener('DOMContentLoaded', link);
async function link() {
    const route = routes[window.location.pathname] || routes[404];
    const template = await fetch(route).then((data) => data.text());
    root.innerHTML = template;
}
link();
