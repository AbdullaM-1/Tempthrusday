// @ts-ignore
import Cookies from "js-cookie";

const CookiesSnapshot = {
  refreshToken: "refreshToken",
  accessToken: "accessToken",
  countriesToken: "countriesToken",
} as const;

export type CookiesType = keyof typeof CookiesSnapshot;

export type CookiesStore = {
  [key in CookiesType]: string;
};

export class CookiesApi {
  private static _store: CookiesStore = Cookies.get();

  public static get store() {
    return this._store;
  }

  public static getValue(key: CookiesType) {
    return Cookies.get(key);
  }

  public static setValue(key: CookiesType, value: any): void {
    Cookies.set(key, value);
  }
}
