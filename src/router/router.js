class Router {
	#routingMiddlewares;
	#currentRoute;
	#isApp;

	constructor() {
		this.#routingMiddlewares = [];
	}

	getRoutingMiddlewares() {
		return this.#routingMiddlewares;
	}

	route(route, instance) {
		if (instance) this.#isApp = instance;
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

		const function3 = (args) => {
			const route = args[0];
			for (let i = 1; i < args.length; i++) {
				const cb = args[i];
				this.#routingMiddlewares.push({ method, route, cb });
			}
		};

		if (args.length === 1) {
			return function1(args[0]);
		} else if (args.length === 2) {
			return funciton2(args[0], args[1]);
		} else {
			return function3(args);
		}
	}

	get(...args) {
		if (this.#isApp) {
			this.#isApp.use({
				method: "GET",
				route: this.#currentRoute,
				cb: args[0],
			});
			return this;
		}

		return this.#addRoutingMiddleware(args, "GET");
	}

	post(...args) {
		if (this.#isApp) {
			this.#isApp.use({
				method: "POST",
				route: this.#currentRoute,
				cb: args[0],
			});
			return this;
		}
		return this.#addRoutingMiddleware(args, "POST");
	}

	delete(...args) {
		if (this.#isApp) {
			this.#isApp.use({
				method: "DELETE",
				route: this.#currentRoute,
				cb: args[0],
			});
			return this;
		}
		return this.#addRoutingMiddleware(args, "DELETE");
	}

	patch(...args) {
		if (this.#isApp) {
			this.#isApp.use({
				method: "PATCH",
				route: this.#currentRoute,
				cb: args[0],
			});
			return this;
		}
		return this.#addRoutingMiddleware(args, "PATCH");
	}

	put(...args) {
		if (this.#isApp) {
			this.#isApp.use({
				method: "PUT",
				route: this.#currentRoute,
				cb: args[0],
			});
			return this;
		}
		return this.#addRoutingMiddleware(args, "PUT");
	}
}

export default Router;
