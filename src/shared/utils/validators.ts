// Validator type constants
const VALIDATOR_TYPE_REQUIRE = 'REQUIRE';
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_MAXLENGTH = 'MAXLENGTH';
const VALIDATOR_TYPE_MIN = 'MIN';
const VALIDATOR_TYPE_MAX = 'MAX';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';
const VALIDATOR_TYPE_FILE = 'FILE';
const VALIDATOR_TYPE_PWD = 'PWD';

// returning an object with the type and possibly a value
export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_FILE = () => ({ type: VALIDATOR_TYPE_FILE });
export const VALIDATOR_PWD = () => ({ type: VALIDATOR_TYPE_PWD });
export const VALIDATOR_MINLENGTH = (val: number) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val: val,
});
export const VALIDATOR_MAXLENGTH = (val: number) => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val: val,
});
export const VALIDATOR_MIN = (val: number) => ({
  type: VALIDATOR_TYPE_MIN,
  val: val,
});
export const VALIDATOR_MAX = (val: number) => ({
  type: VALIDATOR_TYPE_MAX,
  val: val,
});
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });

// Type definitions
type ValidatorType =
  | 'REQUIRE'
  | 'MINLENGTH'
  | 'MAXLENGTH'
  | 'MIN'
  | 'MAX'
  | 'EMAIL'
  | 'FILE'
  | 'PWD';
export type ValidatorObjType = {
  //   type: ValidatorType;
  type: string;
  val?: number; // Optional since not all validators need a value (e.g., REQUIRE, EMAIL)
};

// Validate function: Validates a value against an array of validators
export const validate = (
  inputValue: string,
  validators: ValidatorObjType[]
) => {
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      isValid = isValid && inputValue.trim().length > 0;
    }
    if (
      validator.type === VALIDATOR_TYPE_MINLENGTH &&
      validator.val !== undefined
    ) {
      isValid = isValid && inputValue.trim().length >= validator.val;
    }
    if (
      validator.type === VALIDATOR_TYPE_MAXLENGTH &&
      validator.val !== undefined
    ) {
      isValid = isValid && inputValue.trim().length <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MIN && validator.val !== undefined) {
      isValid = isValid && +inputValue >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAX && validator.val !== undefined) {
      isValid = isValid && +inputValue <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(inputValue);
    }
    // Add similar checks for other validators that use `val`
  }
  return isValid;
};
