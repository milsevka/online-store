const currentSettings = settingsObjCreate(window.location.search) || {};
function settingsObjCreate(search: string) {
    if (!search) {
        return;
    }
    search = search.slice(1);
    const arr = search.split('&');
    const arr1 = arr.map((item) => item.split('='));
    const arr2 = arr1.map((item) => item.map((item) => (item.includes('%2C') ? item.split('%2C') : item)));
    return Object.fromEntries(arr2);
}
function setSearch() {
    history.pushState({}, 'newUrl', `?${currentSettings.toString()}`);
}
export { currentSettings, setSearch };
// let search =
//     '?brand=apple%20samsung&category=laptops%20phones&priceMax=1600&priceMin=1300&stockMin=2&stockMax=200&sort=priceAsc&view=small';
