import http from "http";
import Methods from "./methods/method.js";
import Router from './router/router.js'

class RestWave extends Methods {
	#server;
	#request;
	#response;

	constructor() {
		super();
		this.#createServer();
	}

	#createServer() {
		this.#server = http.createServer((req, res) => {
			this.#request = req;
			this.#response = res;
			this.#setResponseType();
			this.#handleRequests();
		});
	}

	async #handleRequests() {
		await this.#parseData();
		this.#extractQueryParameters();
		let i = 0;
		const next = () => {
			const currentMiddleware = super.getMiddlewares()[i];

			i++;
			if (typeof currentMiddleware === "function") {
				currentMiddleware(this.#request, this.#response, next);
			} else if (i <= super.getMiddlewares().length) {
				const method = this.#request.method;
				if (method === "GET" && currentMiddleware.method === method) {
					if (!this.#handleMethodRequests(currentMiddleware, next)) {
						next();
					}
				} else if (method === "PATCH" && currentMiddleware.method === method) {
					if (!this.#handleMethodRequests(currentMiddleware, next)) {
						next();
					}
				} else if (method === "POST" && currentMiddleware.method === method) {
					if (!this.#handleMethodRequests(currentMiddleware, next)) {
						next();
					}
				} else if (method === "DELETE" && currentMiddleware.method === method) {
					if (!this.#handleMethodRequests(currentMiddleware, next)) {
						next();
					}
				} else if (currentMiddleware.method === "ANY") {
					if (!this.#handleMethodRequests(currentMiddleware, next)) {
						next();
					}
				} else {
					if (i <= super.getMiddlewares().length) {
						next();
					} else {
						throw new Error("Requested endpoint not handled");
					}
				}
			} else {
				throw new Error("Requested endpoint not handled");
			}
		};
		next();
	}

	#handleMethodRequests(currentMiddleware, next) {
		if (currentMiddleware.hasOwnProperty("params")) {
			this.#request.params = {};
			const rUrl = this.#request.url.split("/");
			const cUrl = currentMiddleware.route.split("/");
			let currentParam = 0;
			if (rUrl.length !== cUrl.length) return false;
			for (let i = 0; i < rUrl.length; i++) {
				if (
					cUrl[i].startsWith(":") &&
					currentParam < currentMiddleware.params.length &&
					rUrl[i]
				) {
					this.#request.params[
						Object.keys(currentMiddleware.params[currentParam])[0]
					] = rUrl[i];
					currentParam++;
				} else {
					if (cUrl[i] !== rUrl[i]) {
						this.#request.params = {};
						return false;
					}
				}
			}
			currentMiddleware.cb(this.#request, this.#response, next);
			return true;
		} else if (currentMiddleware.route === this.#request.url) {
			currentMiddleware.cb(this.#request, this.#response, next);
			return true;
		}
	}

	#extractQueryParameters() {
		const queryParameters = {};
		const [urlString, queryString] = this.#request.url.split("?");
		if (!queryString) return;
		queryString.split("&").forEach((query) => {
			const [key, value] = query.split("=");
			queryParameters[key] = value;
		});
		this.#request.query = queryParameters;
		this.#request.url = urlString;
	}

	#parseData() {
		return new Promise((resolve) => {
			let body = "";
			this.#request.on("data", (chunck) => {
				body += chunck;
			});

			this.#request.on("end", () => {
				if (!body) resolve();
				else {
					this.#request.body = JSON.parse(body);
					resolve(this.#request.body);
				}
			});
		});
	}

	#setResponseType() {
		this.#response.json = (object, statusCode = 200) => {
			this.#response.statusCode = statusCode;
			this.#response.setHeader(
				"Content-Type",
				"application/json;charset=utf-8"
			);
			this.#response.end(JSON.stringify(object));
		};
	}

	listen(...args) {
		const PORT = args[0];
		const cb = args[args.length - 1];
		if (args.length === 2) {
			this.#server.listen(PORT, cb);
		}
		if (args.length === 3) {
		}
	}

}

export default RestWave;
