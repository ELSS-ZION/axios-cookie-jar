import axios, { AxiosInstance, AxiosStatic } from 'axios'
import { CookieJar, Cookie } from 'tough-cookie'


declare module 'axios' {
	interface AxiosInstance {
		cookieJar?: CookieJar;
		__cookieJarRequestMiddlewareId?: number;
		__cookieJarResponseMiddlewareId?: number;
	}
}


export function setupCookieJar<T extends AxiosStatic | AxiosInstance>(axios: T, cookieJar: CookieJar=new CookieJar()): T {
	if (axios.__cookieJarRequestMiddlewareId != undefined) {
		axios.interceptors.request.eject(axios.__cookieJarRequestMiddlewareId)
	}
	if (axios.__cookieJarResponseMiddlewareId != undefined) {
		axios.interceptors.request.eject(axios.__cookieJarResponseMiddlewareId)
	}

	const cookieJarRequestMiddlewareId = axios.interceptors.request.use(async function (config: any) {
		const cookies = await cookieJar.getCookies(config.url)
		let cookiesString = ''

		for (const v of cookies) {
			cookiesString += `${v.key}=${v.value}; `
		}
		config.headers.cookie = cookiesString
		return config
	})


	const cookieJarResponseMiddlewareId = axios.interceptors.response.use(async function (response) {
		if (response.headers['set-cookie'] instanceof Array) {
			const cookies = response.headers['set-cookie']
			for (let v of cookies) {
				const cookie = Cookie.parse(v)
				if (cookie == undefined) {
					continue
				}
				if (response.config?.url == undefined) {
					continue
				}
				cookieJar.setCookie(cookie, response.config.url)
			}
		}
		return response;
	})

	axios.cookieJar = cookieJar
	axios.__cookieJarRequestMiddlewareId = cookieJarRequestMiddlewareId
	axios.__cookieJarResponseMiddlewareId = cookieJarResponseMiddlewareId
	return axios
}


setupCookieJar(axios)

export default {}
