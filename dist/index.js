"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCookieJar = void 0;
const axios_1 = require("axios");
const tough_cookie_1 = require("tough-cookie");
function setupCookieJar(axios, cookieJar = new tough_cookie_1.CookieJar()) {
    if (axios.__cookieJarRequestMiddlewareId != undefined) {
        axios.interceptors.request.eject(axios.__cookieJarRequestMiddlewareId);
    }
    if (axios.__cookieJarResponseMiddlewareId != undefined) {
        axios.interceptors.request.eject(axios.__cookieJarResponseMiddlewareId);
    }
    const cookieJarRequestMiddlewareId = axios.interceptors.request.use(async function (config) {
        const cookies = await cookieJar.getCookies(config.url);
        let cookiesString = '';
        for (const v of cookies) {
            cookiesString += `${v.key}=${v.value}; `;
        }
        config.headers.cookie = cookiesString;
        return config;
    });
    const cookieJarResponseMiddlewareId = axios.interceptors.response.use(async function (response) {
        if (response.headers['set-cookie'] instanceof Array) {
            const cookies = response.headers['set-cookie'];
            for (let v of cookies) {
                const cookie = tough_cookie_1.Cookie.parse(v);
                if (cookie == undefined) {
                    continue;
                }
                if (response.config?.url == undefined) {
                    continue;
                }
                cookieJar.setCookie(cookie, response.config.url);
            }
        }
        return response;
    });
    axios.cookieJar = cookieJar;
    axios.__cookieJarRequestMiddlewareId = cookieJarRequestMiddlewareId;
    axios.__cookieJarResponseMiddlewareId = cookieJarResponseMiddlewareId;
    return axios;
}
exports.setupCookieJar = setupCookieJar;
setupCookieJar(axios_1.default);
__exportStar(require("tough-cookie"), exports);
