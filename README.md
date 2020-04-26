# Google Analytics URL-shortener container [![Build Status](https://travis-ci.com/auxility/url-shortener.svg?branch=master)](https://travis-ci.com/auxility/url-shortener)

[![Docker Hub](https://dockeri.co/image/auxility/url-shortener)](https://hub.docker.com/r/auxility/url-shortener)

## Running

### Docker

```Shell
docker pull auxility/url-shortener
# assuming MongoDB is running on the host network
docker run -d --name url-shortener -e PORT=80 -e GA_UA_ID=UA-12345678-1 -e DB_HOST=host.docker.internal -p 3001:80 auxility/url-shortener
```

### Classic

This requires `mongo` and `node` (and optionally `nodemon`) to be installed already on your platform.

```Shell
cd url-shortener
npm install
node src/index.js # Or `nodemon src/index.js` for auto restarts on code changes
```

## Usage

The simplest way to create a short url is using the web interface. Just visit the address for the node server you are running.

That might be `http://localhost:3000/` when developing locally or `http://domain.tld/` once you have it running on a server and DNS entries in place.

You can then generate new short codes using the form.

Once a short code has been created just visit `http://domain.tld/:short` and you will be redirected to the specified url.

Example `http://domain.tld/ueKZ8y2` might redirect to `http://www.example.com/my/very/long/url/which/is/too/long/for/easy/sharing.html`

You can also use the API directly or to create other clients for creating short urls.

## API

All API responses are `json` and take the form of:

```
{
  "status": http_code,
  "message": human_readable_string,
  "result": data_object
}
```

### `POST` `http://domain.tld/api/create`

Creates a new shortened url.

#### Request

| Parameter | Description |
| --------- | ----------- |
| `url`     | url to be shortened. |
| `short`   | _(optional)_ short code to use. If not set one will be generated for you. |
| `campaign` | _(optional)_ Campaign object, UTM params to be injected into outbound redirects and GA event |

##### `Campaign` object
| Parameter | Description |
| --------- | ----------- |
| `campaign`     |  |
| `medium`     |  |
| `source`     |  |
| `content`     |  |

#### Response `result`

| Property | Description |
| --------- | ----------- |
| `url`     | The url object created. |
| `short`   | the short code used. |
| `baseurl`   | the base url of the server. |

#### Example

```
$ curl -d url=http://www.informaticslab.co.uk/ http://domain.tld/api/create
{"status":201,"message":"Success, short created!","result":{"url":"http://www.informaticslab.co.uk/","short":"nUAm7HC","baseurl":"http://domain.tld"}}
```

### `GET` `http://domain.tld/api/check/:short`

Returns whether a short code exists. Will return `404` if it doesn't exist.

#### Response `result`

| Property | Description |
| --------- | ----------- |
| `url`     | the url which has been shortened. |
| `short`   | the short code used. |
| `baseurl`   | the base url of the server. |

#### Example

```
$ curl http://domain.tld/api/check/nUAm7HC
{"status":200,"message":"Short exists","result":{"url":"http://www.informaticslab.co.uk/","short":"nUAm7HC","baseurl":"http://domain.tld"}}

$ curl http://domain.tld/api/check/h8Jk0sl
{"status":404,"message":"Short not found","result":null}
```

### `GET` `http://domain.tld/api/genshort`

Returns a random string to use as a short.

#### Response `result`

| Property | Description |
| --------- | ----------- |
| `short`   | the generated short code. |
| `baseurl`   | the base url of the server. |

#### Example

```
$ curl http://domain.tld/api/genshort
{"status":200,"message":"Generated","result":{"short":"h1ZCaYw","baseurl":"http://domain.tld"}}
```

## Runtime environment variables

To configure your server you can set some environment variables before starting the node application. If you're using docker simply pass the variables in the run command with `-e VAR=value`, otherwise set them with `export VAR=value` within your bash environment.

| Variable | Description | Default |
| -------- | ----------- | ------- |
| PORT | The port to run your node express server on. | `3000` |
| DB_HOST | The hostname of your mongodb server. | `mongo` |
| DB_PORT | The port of your mongodb server. | `27017` |
| DB_NAME | The database name to use. | `urlshort` |
| SHORT_LENGTH | The length of a randomly generated short code | `7` |
| ROOT_REDIRECT | The url to redirect to from  `http://domain.tld:port/`. | `/web/index.html` |
| BASE_URL | External URL of your node server | `localhost` |
| GA_UA_ID | Google Analytics Property Tracking ID |
## Contributing
Pull requests are appreciated

## License
GPLv3
