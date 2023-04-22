import http from "http";

/**
 * A class for storing and managing middleware functions
 */
class Methods {
	#totalMiddlewares;

	constructor() {
		this.#totalMiddlewares = [];
	}

	/**
	 * Add a middleware function to the list of total middlewares.
	 * @param {(Router|Function)} args - The middleware function or a Router instance.
	 * @returns {void}
	 */

	#extractParams(route) {
		let newRoute = "";
		const params = [];
		route.split("/").forEach((word) => {
			if (word) {
				if (word.startsWith(":")) {
					newRoute += "/:";
					params.push({ [word.substring(1)]: undefined });
				} else newRoute += "/" + word;
			}
		});
		return { newRoute, params };
	}

	#addMiddlewares(method, route, cb) {
		const { newRoute, params } = this.#extractParams(route);
		if (newRoute && Object.keys(params).length) {
			this.#totalMiddlewares.push({
				method,
				route: newRoute,
				cb,
				params,
			});
		} else {
			this.#totalMiddlewares.push({ method, route, cb });
		}
	}

	use(...args) {
		if (args.length === 1) {
			if (args[0] instanceof Router) {
				args[0].getRoutingMiddlewares().forEach((routingMiddleware) => {
					this.#addMiddlewares(
						routingMiddleware.method,
						routingMiddleware.route,
						routingMiddleware.cb
					);
				});
			} else this.#totalMiddlewares.push(args[0]);
		} else if (args.length === 2) {
			if (args[1] instanceof Router) {
				args[1].getRoutingMiddlewares().forEach((routingMiddleware) => {
					this.#addMiddlewares(
						routingMiddleware.method,
						args[0] + routingMiddleware.route,
						routingMiddleware.cb
					);
				});
			} else {
				this.#addMiddlewares("ANY", args[0], args[1]);
			}
		}
		console.log(this.#totalMiddlewares);
	}

	/**
	 * Add a GET middleware function to the list of total middlewares.
	 * @param {string} route - The route to match.
	 * @param {Function} cb - The middleware function to execute.
	 * @returns {void}
	 */
	get(route, cb) {
		this.#addMiddlewares("GET", route, cb);
	}

	/**
	 * Add a PATCH middleware function to the list of total middlewares.
	 * @param {string} route - The route to match.
	 * @param {Function} cb - The middleware function to execute.
	 * @returns {void}
	 */
	patch(route, cb) {
		this.#addMiddlewares("PATCH", route, cb);
	}

	/**
	 * Add a POST middleware function to the list of total middlewares.
	 * @param {string} route - The route to match.
	 * @param {Function} cb - The middleware function to execute.
	 * @returns {void}
	 */
	post(route, cb) {
		this.#addMiddlewares("POST", route, cb);
	}

	/**
	 * Add a DELETE middleware function to the list of total middlewares.
	 * @param {string} route - The route to match.
	 * @param {Function} cb - The middleware function to execute.
	 * @returns {void}
	 */
	delete(route, cb) {
		this.#addMiddlewares("DELETE", route, cb);
	}

	/**
	 * Return the list of total middlewares.
	 * @returns {Object[]} An array of middleware objects containing method, route, and cb properties.
	 */
	getMiddlewares() {
		return this.#totalMiddlewares;
	}
}

class Router {
	#routingMiddlewares;
	#currentRoute;

	constructor() {
		this.#routingMiddlewares = [];
	}

	getRoutingMiddlewares() {
		return this.#routingMiddlewares;
	}

	route(route) {
		this.#currentRoute = route;
		return this;
	}

	#addRoutingMiddleware(args, method) {
		const function1 = (cb) => {
			this.#routingMiddlewares.push({
				method,
				route: this.#currentRoute,
				cb,
			});
			return this;
		};

		const funciton2 = (route, cb) => {
			this.#routingMiddlewares.push({ method, route, cb });
		};

		if (args.length === 1) {
			return function1(args[0]);
		} else if (args.length === 2) {
			return funciton2(args[0], args[1]);
		}
	}

	get(...args) {
		return this.#addRoutingMiddleware(args, "GET");
	}

	post(...args) {
		return this.#addRoutingMiddleware(args, "POST");
	}

	delete(...args) {
		return this.#addRoutingMiddleware(args, "DELETE");
	}

	patch(...args) {
		return this.#addRoutingMiddleware(args, "PATCH");
	}
}

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

export { RestWave, Router };
