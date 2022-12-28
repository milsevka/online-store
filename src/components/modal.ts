import { ADDRESS_REGEXP, EMAIL_REGEXP, NAME_REGEXP, PHONE_REGEXP } from './constants';

export function openModal() {
    (document.querySelector('.modal_container') as HTMLDivElement).addEventListener('click', () => {
        const fragment = document.createDocumentFragment();
        const fragmentId = document.querySelector('#modal') as HTMLTemplateElement;
        const cardClone = fragmentId.content.cloneNode(true) as HTMLElement;
        fragment.append(cardClone);
        const modalContainer = document.querySelector('.modal_container_content') as HTMLDivElement;
        modalContainer.append(fragment);
        validate();
    });
}
function validate() {
    (document.querySelector('#input_number') as HTMLInputElement).addEventListener('input', cardNumber);
    function cardNumber() {
        let cardCode = (document.querySelector('#input_number') as HTMLInputElement).value
            .replace(/\D/g, '')
            .substring(0, 16);
        if (cardCode) cardCode = cardCode.match(/.{1,4}/g)!.join(' ');
        (document.querySelector('#input_number') as HTMLInputElement).value = cardCode;
        if (cardCode.length === 19) {
            (document.querySelector('#input_number') as HTMLInputElement).style.borderColor = 'green';
        } else {
            (document.querySelector('#input_number') as HTMLInputElement).style.borderColor = 'red';
        }
        switch ((document.querySelector('#input_number') as HTMLInputElement).value[0]) {
            case '5':
                (document.querySelector('.card_photo') as HTMLImageElement).src = '../assets/icons/master-card.png';
                break;
            case '4':
                (document.querySelector('.card_photo') as HTMLImageElement).src = '../assets/icons/visa-card.png';
                break;
            case '3':
                (document.querySelector('.card_photo') as HTMLImageElement).src = '../assets/icons/amex-card.png';
                break;
            default:
                (document.querySelector('.card_photo') as HTMLImageElement).src = '../assets/icons/credit-card.png';
                break;
        }
    }

    (document.querySelector('#input_valid') as HTMLInputElement).addEventListener('input', cardDate);
    function cardDate() {
        let cardCode = (document.querySelector('#input_valid') as HTMLInputElement).value
            .replace(/\D/g, '')
            .substring(0, 4);
        if (cardCode) cardCode = cardCode.match(/.{1,2}/g)!.join('/');
        (document.querySelector('#input_valid') as HTMLInputElement).value = cardCode;
        if (Number(cardCode.split('/')[0]) > 0 && Number(cardCode.split('/')[0]) <= 12) {
            (document.querySelector('#input_valid') as HTMLInputElement).style.borderColor = 'green';
        } else {
            (document.querySelector('#input_valid') as HTMLInputElement).style.borderColor = 'red';
        }
    }

    const input = document.querySelector('#input_email') as HTMLInputElement;
    input.addEventListener('input', onInput);
    function onInput() {
        if (isEmailValid(input.value)) {
            input.style.borderColor = 'green';
            (document.querySelector('#error_email') as HTMLSpanElement).classList.remove('error_open');
        } else {
            input.style.borderColor = 'red';
            (document.querySelector('#error_email') as HTMLSpanElement).classList.add('error_open');
        }
    }
    function isEmailValid(value: string) {
        return EMAIL_REGEXP.test(value);
    }

    const inputphone = document.querySelector('#input_phone') as HTMLInputElement;
    inputphone.addEventListener('input', onInputPh);
    function onInputPh() {
        if (isPhValid(inputphone.value)) {
            inputphone.style.borderColor = 'green';
            (document.querySelector('#error_phone') as HTMLSpanElement).classList.remove('error_open');
        } else {
            inputphone.style.borderColor = 'red';
            (document.querySelector('#error_phone') as HTMLSpanElement).classList.add('error_open');
        }
    }
    function isPhValid(value: string) {
        return PHONE_REGEXP.test(value);
    }

    const inputname = document.querySelector('#input_name') as HTMLInputElement;
    inputname.addEventListener('input', onInputName);
    function onInputName() {
        if (isNameValid(inputname.value)) {
            inputname.style.borderColor = 'green';
            (document.querySelector('#error_name') as HTMLSpanElement).classList.remove('error_open');
        } else {
            inputname.style.borderColor = 'red';
            (document.querySelector('#error_name') as HTMLSpanElement).classList.add('error_open');
        }
    }
    function isNameValid(value: string) {
        return NAME_REGEXP.test(value);
    }

    const inputadress = document.querySelector('#input_address') as HTMLInputElement;
    inputadress.addEventListener('input', onInputAddress);
    function onInputAddress() {
        if (isAddValid(inputadress.value)) {
            inputadress.style.borderColor = 'green';
            (document.querySelector('#error_address') as HTMLSpanElement).classList.remove('error_open');
        } else {
            inputadress.style.borderColor = 'red';
            (document.querySelector('#error_address') as HTMLSpanElement).classList.add('error_open');
        }
    }
    function isAddValid(value: string) {
        return ADDRESS_REGEXP.test(value);
    }

    const inputacvv = document.querySelector('#input_cvv') as HTMLInputElement;
    inputacvv.addEventListener('input', onInputCvv);
    function onInputCvv() {
        inputacvv.value = inputacvv.value.replace(/\D/g, '').substring(0, 3);
        if (inputacvv.value.length === 3) {
            inputacvv.style.borderColor = 'green';
        } else {
            inputacvv.style.borderColor = 'red';
        }
    }

    const form = document.querySelector('.modal_form') as HTMLFormElement;

    form.addEventListener('submit', function (event) {
        const array = document.querySelectorAll('.form_control') as NodeListOf<HTMLInputElement>;
        const arrayValid: string[] = [];
        const arrayInvalid: string[] = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i].style.borderColor === 'green') {
                arrayValid.push(array[i].id);
            } else {
                arrayInvalid.push(array[i].id);
            }
        }
        const arrayText = [];
        for (let i = 0; i < arrayInvalid.length; i++) {
            switch (arrayInvalid[i]) {
                case 'input_name':
                    (document.querySelector('#error_name') as HTMLSpanElement).classList.add('error_open');
                    break;
                case 'input_phone':
                    (document.querySelector('#error_phone') as HTMLSpanElement).classList.add('error_open');
                    break;
                case 'input_address':
                    (document.querySelector('#error_address') as HTMLSpanElement).classList.add('error_open');
                    break;
                case 'input_email':
                    (document.querySelector('#error_email') as HTMLSpanElement).classList.add('error_open');
                    break;
                default:
                    arrayText.push(` Error card ${arrayInvalid[i].split('_')[1]}`);
                    break;
            }
        }
        const errortext = document.querySelector('.error-message') as HTMLPreElement;
        if (arrayValid.length === 7) {
            errortext.textContent = '';
            form.submit();
        } else {
            errortext.textContent = arrayText.join('\n');
            event.preventDefault();
        }
    });
}
