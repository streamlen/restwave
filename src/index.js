import http from "http";

class Velocity {
	#server;
	#request;
	#response;
	#totalMiddlewares;

	constructor() {
		this.#totalMiddlewares = [];
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
		console.log(this.#request.query);
		console.log(this.#request.url);
		let i = 0;
		const next = () => {
			const currentMiddleware = this.#totalMiddlewares[i];

			i++;
			if (typeof currentMiddleware === "function") {
				currentMiddleware(this.#request, this.#response, next);
			} else if (i <= this.#totalMiddlewares.length) {
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
				} else {
					if (i <= this.#totalMiddlewares.length) {
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

	use(...args) {
		if (args.length === 1) this.#totalMiddlewares.push(args[0]);
		else {
			this.#totalMiddlewares.push({ route: args[0], cb: args[1] });
		}
	}

	get(route, cb) {
		this.#totalMiddlewares.push({ method: "GET", route, cb });
	}

	patch(route, cb) {
		this.#totalMiddlewares.push({ method: "PATCH", route, cb });
	}

	post(route, cb) {
		this.#totalMiddlewares.push({ method: "POST", route, cb });
	}

	delete(route, cb) {
		this.#totalMiddlewares.push({ method: "DELETE", route, cb });
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

const app = new Velocity();

app.listen(5000, () => {
	console.log(`listeing on port: 5000`);
});

app.use((req, res, next) => {
	console.log("middleware 1");
	next();
});

app.use((req, res, next) => {
	console.log("middleware 2");
	next();
});

app.get("/", (req, res, next) => {
	// res.json({ name: "get adarsh" }, 203);
	next();
});

app.get("/", (req, res) => {
	res.json({ name: "get adarsh" }, 203);
});

app.patch("/", (req, res) => {
	res.json({ name: "patch adarsh" }, 202);
});

app.delete("/", (req, res) => {
	res.json({ name: "delete adarsh" }, 201);
});

app.post("/adarsh", (req, res) => {
	console.log("came here");
	res.json({ name: "another post adarsh" }, 201);
});

app.post("/", (req, res, next) => {
	console.log("one came here");
	// res.json({ name: "post adarsh" }, 201);
	next();
});

app.post("/", (req, res) => {
	console.log("two came here");
	res.json({ name: "post adarsh" }, 201);
});
