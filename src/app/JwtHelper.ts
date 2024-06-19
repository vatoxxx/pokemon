import {jwtDecode} from 'jwt-decode';

export class JwtHelper {
  static getTokenExpirationDate(token: string): Date | null {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  static isTokenExpired(token: string): boolean {
    const expirationDate = this.getTokenExpirationDate(token);
    return expirationDate ? expirationDate < new Date() : false;
  }
}
