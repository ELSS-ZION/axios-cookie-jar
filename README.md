# axios-cookie-jar

setup cookie jar to axios

## Install

```
npm i axios axios-cookie-jar
```

## Usage

```js
import axios from 'axios';
import 'axios-cookie-jar';

async function main() {
	await axios.get('http://www.google.com')
	console.log(axios.cookieJar?.getCookiesSync('http://www.google.com'))
}

main()
```

```js
import axios from 'axios';
import { setupCookieJar } from 'axios-cookie-jar';

async function main() {
    const instance = axios.create({
        proxy: {
            protocol: 'http',
            host: '127.0.0.1',
            port: 8888
        }
    })
    setupCookieJar(instance)

	await instance.get('http://www.google.com')
	console.log(instance.cookieJar?.getCookiesSync('http://www.google.com'))
}

main()
```

## License

[MIT (c) 3846masa](./LICENSE)