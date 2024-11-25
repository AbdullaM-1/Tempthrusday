export class ValidationMessagesService {
  private static _minCharacters = 2;
  public static minCharacters() {
    return this._minCharacters;
  }

  public static getMinimumCharactersMessage() {
    return `Minimum ${this._minCharacters} characters`;
  }

  private static _maxCharacters = 60;
  public static maxCharacters() {
    return this._maxCharacters;
  }

  public static getMaximumCharactersMessage() {
    return `Maximum ${this._maxCharacters} characters`;
  }

  private static _minPasswordLength = 8;
  public static getMinPasswordLength() {
    return this._minPasswordLength;
  }

  public static getValidatePasswordLengthMessage() {
    return `Password must be at least ${this._minPasswordLength} characters`;
  }

  private static _availableFileFormats = [".jpeg", ".jpg", ".png", ".webp"];
  public static getAvailableFileFormats() {
    return this._availableFileFormats.join(",");
  }

  public static getAvailableFileFormatsMessage() {
    return `File must be - ${this.getAvailableFileFormats()}`;
  }

  private static _passwordsMustMatch = "Passwords must match";
  public static getPasswordsMustmatch() {
    return this._passwordsMustMatch;
  }

  private static _maxFileSize = 5000000;
  public static getMaxFileSize() {
    return this._maxFileSize;
  }

  public static getMaxFileSizeMessage() {
    return "Less than " + `${this._maxFileSize}`.split("")[0] + "MB";
  }

  private static _validateNumber = "Enter a valid number";
  public static getValidateNumber() {
    return this._validateNumber;
  }

  private static _validateYear = "Enter a valid year";
  public static getValidateYear() {
    return this._validateYear;
  }

  private static _required = "Required";
  public static getRequiredMessage() {
    return this._required;
  }

  private static _validateEmailMessage = "Enter a valid email";
  public static getValidateEmailMessage() {
    return this._validateEmailMessage;
  }

  private static _validatePhoneMessage =
    "Phone number must contain only digits and start with +";
  public static getValidatePhoneMessage() {
    return this._validatePhoneMessage;
  }

  private static _validatePriceType = "Enter a valid price type";
  public static getValidatePriceType() {
    return this._validatePriceType;
  }
}
