import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.window = Object.create(window);
const url = '?category=Smartphones';
Object.defineProperty(window, 'location', {
    value: new URL('http://example.com'),
    configurable: true,
});
