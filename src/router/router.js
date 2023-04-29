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

export default Router;