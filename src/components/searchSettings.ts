import { IsearchSettings } from './type';
const currentSettings = settingsObjCreate(window.location.search) || {};

function settingsObjCreate(search: string): IsearchSettings | undefined {
    if (!search) {
        return;
    }
    search = search.slice(1);
    const arr = search.split('&');
    const arr1 = arr.map((item) => item.split('='));
    const arr2 = arr1.map((item) =>
        item.map((item) =>
            item.includes('%2C') ? fullDecode(item).split('%2C') : Number(item) ? Number(item) : fullDecode(item)
        )
    );
    return Object.fromEntries(arr2);
}
function fullDecode(str: string): string {
    return decodeURI(str).replace(/%26/g, '&');
}
function setSearch(): void {
    history.pushState({}, 'newUrl', `?${currentSettings.toString()}`);
}
export { currentSettings, setSearch };
// let search =
//     '?brand=apple%2Csamsung&category=laptops%2Cphones&priceMax=1600&priceMin=1300&stockMin=2&stockMax=200&sort=priceAsc&view=small';
