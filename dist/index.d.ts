import { AxiosInstance, AxiosStatic } from 'axios';
import { CookieJar } from 'tough-cookie';
declare module 'axios' {
    interface AxiosInstance {
        cookieJar?: CookieJar;
        __cookieJarRequestMiddlewareId?: number;
        __cookieJarResponseMiddlewareId?: number;
    }
}
export declare function setupCookieJar<T extends AxiosStatic | AxiosInstance>(axios: T, cookieJar?: CookieJar): T;
declare const _default: {};
export default _default;
