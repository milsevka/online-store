export const EMAIL_REGEXP =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
export const PHONE_REGEXP = /^\+\d{9,}$/;
export const NAME_REGEXP = /^[a-zA-ZА-Яа-яЁё]{3,} (?:[a-zA-ZА-Яа-яЁё]{3,} *)+$/;
export const ADDRESS_REGEXP = /^(?:[a-zA-ZА-Яа-яЁё]{5,} *){3,}/;
