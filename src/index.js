import http from "http";

class Velocity {
	#server;
	#request;
	#response;

	constructor() {
		this.#createServer();
	}

	#createServer() {
		this.#server = http.createServer((req, res) => {
			console.log("When requests intiates");
			this.#request = req;
			this.#response = res;
			this.#handleRequests();
		});
		// console.log(this.#server);
	}

	#handleRequests() {
		if (this.#request.url === "/") {
			console.log(this.#response);
			this.#response.statusCode = 200;
			this.#response.setHeader("Content-Type", "text/plain;charset=utf-8");
			this.#response.end("adarsh shahi from server");
		}
	}

	use(cb) {
		// console.log(this.#request, this.#response);
		cb(this.#request, this.#response);
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
