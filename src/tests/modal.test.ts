import { isAddValid, isEmailValid, isNameValid, isPhValid } from '../components/modal';

describe('Modal-purchase', () => {
    describe('phone number in modal-purchase', () => {
        test('true phone number', () => {
            const phoneValid = ['+5555555288', '+55558886888', '+5554525188', '+555555288'];
            phoneValid.forEach((item) => expect(isPhValid(item)).toBeTruthy());
        });
        test('false phone number', () => {
            const phoneInvalid = ['+54', '558886888', '+5554188'];
            phoneInvalid.forEach((item) => expect(isPhValid(item)).toBeFalsy());
        });
    });
    describe('personal address in modal-purchase', () => {
        test('valid address', () => {
            const addressValid = ['Belarus Minsk Nemiga', 'Беларусь Минск Притыцкого'];
            addressValid.forEach((item) => expect(isAddValid(item)).toBeTruthy());
        });
        test('invalid address', () => {
            const addressInvalid = ['USA Florida Nem', 'Беларусь Минск Мир'];
            addressInvalid.forEach((item) => expect(isAddValid(item)).toBeFalsy());
        });
    });
    describe('personal name in modal-purchase', () => {
        test('valid name', () => {
            const nameValid = ['Ivan Ivanov', 'IVAN KOZLOV', 'Илья Сидоров'];
            nameValid.forEach((item) => expect(isNameValid(item)).toBeTruthy());
        });
        test('invalid name', () => {
            const addressInvalid = ['Iv IV', 'Вит42 54', 'Саша Му'];
            addressInvalid.forEach((item) => expect(isNameValid(item)).toBeFalsy());
        });
    });
    describe('personal e-mail in modal-purchase', () => {
        test('valid e-mail', () => {
            const emailValid = ['example@example.com', 'example42@ru.com'];
            emailValid.forEach((item) => expect(isEmailValid(item)).toBeTruthy());
        });
        test('invalid e-mail', () => {
            const emailInvalid = ['example.com', 'example@'];
            emailInvalid.forEach((item) => expect(isEmailValid(item)).toBeFalsy());
        });
    });
});
