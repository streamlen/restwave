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
	use(...args) {
		if (args.length === 1) {
			if (args[0] instanceof Router) {
				this.#totalMiddlewares.push(...args[0].getRoutingMiddlewares());
			} else this.#totalMiddlewares.push(args[0]);
		} else if (args.length === 2) {
			if (args[1] instanceof Router) {
				args[1].getRoutingMiddlewares().forEach((routingMiddleware) =>
					this.#totalMiddlewares.push({
						method: routingMiddleware.method,
						route: args[0] + routingMiddleware.route,
						cb: routingMiddleware.cb,
					})
				);
			} else {
				this.#totalMiddlewares.push({
					method: "ANY",
					route: args[0],
					cb: args[1],
				});
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
		this.#totalMiddlewares.push({ method: "GET", route, cb });
	}

	/**
	 * Add a PATCH middleware function to the list of total middlewares.
	 * @param {string} route - The route to match.
	 * @param {Function} cb - The middleware function to execute.
	 * @returns {void}
	 */
	patch(route, cb) {
		this.#totalMiddlewares.push({ method: "PATCH", route, cb });
	}

	/**
	 * Add a POST middleware function to the list of total middlewares.
	 * @param {string} route - The route to match.
	 * @param {Function} cb - The middleware function to execute.
	 * @returns {void}
	 */
	post(route, cb) {
		this.#totalMiddlewares.push({ method: "POST", route, cb });
	}

	/**
	 * Add a DELETE middleware function to the list of total middlewares.
	 * @param {string} route - The route to match.
	 * @param {Function} cb - The middleware function to execute.
	 * @returns {void}
	 */
	delete(route, cb) {
		this.#totalMiddlewares.push({ method: "DELETE", route, cb });
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

	get(...args) {
		const function1 = (cb) => {
			this.#routingMiddlewares.push({
				method: "GET",
				route: this.#currentRoute,
				cb,
			});
			console.log(this);
			return this;
		};

		const funciton2 = (route, cb) => {
			console.log("came");
			this.#routingMiddlewares.push({ method: "GET", route, cb });
		};

		if (args.length === 1) {
			return function1(args[0]);
		} else if (args.length === 2) {
			return funciton2(args[0], args[1]);
		}
	}

	post(...args) {
		const function1 = (cb) => {
			this.#routingMiddlewares.push({
				method: "POST",
				route: this.#currentRoute,
				cb,
			});
			console.log(this);
			return this;
		};

		const funciton2 = (route, cb) => {
			this.#routingMiddlewares.push({ method: "GET", route, cb });
		};

		if (args.length === 1) {
			return function1(args[0]);
		} else if (args.length === 2) {
			return funciton2(args[0], args[1]);
		}
	}

	delete(...args) {
		const function1 = (cb) => {
			this.#routingMiddlewares.push({
				method: "DELETE",
				route: this.#currentRoute,
				cb,
			});
			console.log(this);
			return this;
		};

		const funciton2 = (route, cb) => {
			this.#routingMiddlewares.push({ method: "GET", route, cb });
		};

		if (args.length === 1) {
			return function1(args[0]);
		} else if (args.length === 2) {
			return funciton2(args[0], args[1]);
		}
	}

	patch(...args) {
		const function1 = (cb) => {
			this.#routingMiddlewares.push({
				method: "PATCH",
				route: this.#currentRoute,
				cb,
			});
			console.log(this);
			return this;
		};

		const funciton2 = (route, cb) => {
			this.#routingMiddlewares.push({ method: "GET", route, cb });
		};

		if (args.length === 1) {
			return function1(args[0]);
		} else if (args.length === 2) {
			return funciton2(args[0], args[1]);
		}
	}
}

class Velocity extends Methods {
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
		if (currentMiddleware.route === this.#request.url) {
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

export { Velocity, Router };
