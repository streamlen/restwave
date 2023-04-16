import http from "http";

class Velocity {
	#server;
	#request;
	#response;
	#getRequests;
	#postRequests;
	#patchRequests;
	#deleteRequests;

	constructor() {
		this.#getRequests = [];
		this.#postRequests = [];
		this.#patchRequests = [];
		this.#deleteRequests = [];
		this.#createServer();
	}

	#createServer() {
		this.#server = http.createServer((req, res) => {
			console.log("When requests intiates");
			this.#request = req;
			this.#response = res;
			this.#setResponseType();
			this.#handleRequests();
		});
	}

	#handleRequests() {
		switch (this.#request.method) {
			case "GET":
				return this.#handleGetRequests();
			case "PATCH":
				return this.#handlePatchRequests();
			case "POST":
				return this.#handlePostRequests();
			case "DELETE":
				return this.#handleDeleteRequests();
			default:
				throw new Error("unhandled method type");
		}
	}

	#handlePatchRequests() {
		this.#handleMethodRequests(this.#patchRequests);
	}

	#handlePostRequests() {
		this.#handleMethodRequests(this.#postRequests);
	}

	#handleGetRequests() {
		this.#handleMethodRequests(this.#getRequests);
	}

	#handleDeleteRequests() {
		this.#handleMethodRequests(this.#deleteRequests);
	}

	#handleMethodRequests(methodRequests) {
		methodRequests.forEach((methodRequest) => {
			if (methodRequest.route === this.#request.url)
				methodRequest.cb(this.#request, this.#response);
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

	use(cb) {
		// console.log(this.#request, this.#response);
		cb(this.#request, this.#response);
	}

	get(route, cb) {
		this.#getRequests.push({ route, cb });
	}

	patch(route, cb) {
		this.#patchRequests.push({ route, cb });
	}

	post(route, cb) {
		this.#postRequests.push({ route, cb });
	}

	delete(route, cb) {
		this.#deleteRequests.push({ route, cb });
	}

	listen(...args) {
		const PORT = args[0];
		const cb = args[args.length - 1];
		if (args.length === 2) {
			this.#server.listen(PORT, cb);
			// console.log(this.#server);
		}
		if (args.length === 3) {
			// this.#server.listen(PORT, cb)
		}
	}
}

const app = new Velocity();

app.listen(5000, () => {
	console.log(`listeing on port: 5000`);
});

app.get("/", (req, res) => {
	res.json({ name: "adarsh" }, 203);
});

app.patch("/", (req, res) => {
	res.json({ name: "adarsh" }, 202);
});

app.post("/", (req, res) => {
	res.json({ name: "adarsh" }, 201);
});

app.delete("/", (req, res) => {
	res.json({ name: "adarsh" }, 201);
});
