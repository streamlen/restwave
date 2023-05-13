import Methods from "./methods/method.js";
import net from "net";
import statusCodes from "./utils/statusCodes.js";
import { getTextContentType, getFileContentType } from "./utils/contentType.js";
import fs from "fs";

class RestWave extends Methods {
	#server;
	#request;
	#response;
	#socket;
	#data;
	#contentLength;
	#responseHeaders = {};

  constructor() {
    super();
    this.#setResponseType();
    this.#request = {
      method: "",
      url: "",
      data: "",
      headers: {},
    };
    this.#createServer();
  }

  #createServer() {
    this.#server = net.createServer((socket) => {
      let body = "";
      this.#contentLength = 0;
      this.#data = "";
      socket.on("data", (data) => {
        this.#socket = socket;
        body = data.toString("utf-8");
        const lines = body.split("\r\n");
        if (lines.length > 1) {
          const contentTypeHeader = lines.find((line) =>
            line.startsWith("Content-Type:")
          );
          if (
            contentTypeHeader &&
            contentTypeHeader.includes("application/json")
          ) {
            const contentIndex = body.indexOf("\r\n\r\n") + 4;
            this.#request.data = JSON.parse(body.slice(contentIndex));
          }
        }

        // Attach headers to req
        for (let i = 0; i < lines.length; i++) {
          const [key, value] = lines[i].split(":");
          if (!key || !value) continue;
          this.#request.headers[key] = value;
        }

        this.#request.method = body.split(" ")[0];
        this.#request.url = body.split(" ")[1];

				if (this.#request.method === "OPTIONS") {
					this.#socket.write(
						`HTTP/1.1 204 No Content\r\nConnection: keep-alive\r\nAccess-Control-Allow-Headers: *\r\nAccess-Control-Allow-Methods: GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS\r\nAccess-Control-Allow-Origin: *`
					);
					this.#socket.end();
					return;
				}
				this.#setResponseType();
				this.#handleRequests();
			});

			socket.on("error", (err) => {
				console.log(err);
			});
		});
	}

  #handleRequests() {
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
				} else if (method === "PUT" && currentMiddleware.method === method) {
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
						// throw new Error("Requested endpoint not handled");
					}
				}
			} else {
				// throw new Error("Requested endpoint not handled");
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

	#setResponseType() {
		const writeResponse = (arg) => {
			this.#contentLength += arg.length;
			const content = `\r\n\r\n${arg}`;
			return `HTTP/1.1 ${this.#response.statusCode} ${
				statusCodes[this.#response.statusCode]
			}\r\nAccess-Control-Allow-Origin: *\r\nContent-Type: ${
				this.#responseHeaders["Content-Type"]
			}\r\nContent-Length: ${this.#contentLength}${content}`;
		};

		this.#response = {
			statusCode: 200,
			setHeaders: (obj) => {
				this.#responseHeaders = { ...this.#responseHeaders, ...obj };
			},
			json: (arg, sc) => {
				if (sc) this.#response.statusCode = sc;
				if (arg) {
					arg = JSON.stringify(arg);
					const sike = writeResponse(arg);
					this.#socket.write(sike, "utf-8", () => {
						this.#socket.end();
					});
				} else {
					this.#socket.write(writeResponse(""), "utf-8", () => {
						this.#socket.end();
					});
				}
			},
			send: (arg = "", sc) => {
				if (sc) this.#response.statusCode = sc;
				if (arg) {
					if (!this.#responseHeaders.hasOwnProperty("Content-Type")) {
						const type = getTextContentType(arg);
						if (type === "application/json") {
							arg = JSON.stringify(arg);
						}
						this.#response.setHeaders({
							"Content-Type": type,
						});
					}
				}
				const sike = writeResponse(arg);
				this.#socket.write(sike, "utf-8", () => {
					this.#socket.end();
				});
			},

			sendFile: (path) => {
				if (!path) throw new Error("Path name expected.");
				const file = fs.readFileSync(path);
				if (!this.#responseHeaders.hasOwnProperty("Content-Type")) {
					const type = getFileContentType(path);
					this.#response.setHeaders({
						"Content-Type": type,
					});
				}
				// Prepare HTTP headers
				const headers = [
					`HTTP/1.1 ${this.#response.statusCode} ${
						statusCodes[this.#response.statusCode]
					}`,
					`Content-Type: ${getFileContentType(path)}`,
					`Content-Length: ${file.length}`,
					"Access-Control-Allow-Origin: *",
					"Connection: close",
					"\r\n",
				].join("\r\n");

				// Combine headers and video file data
				const httpResponse = Buffer.concat([Buffer.from(headers), file]);

				// Step 4: Send the HTTP response to the client
				// this.#socket.write(writeResponse(file));
				this.#socket.write(httpResponse);
				this.#socket.end();

				// const fileReadHandler = await fs.open(path);
				// const stream = fileReadHandler.createReadStream();
				// this.#response.setHeaders({ "Content-Type": "video/mp4" });
				// this.#socket.write(
				// 	`HTTP/1.1 206 ${
				// 		statusCodes["206"]
				// 	}\r\nAccess-Control-Allow-Origin: *\r\nContent-Type: ${
				// 		this.#responseHeaders["Content-Type"]
				// 	}`
				// );
				// stream.pipe(this.#socket.write);
			},
		};
	}

  listen(...args) {
    let port = Number(args[0]) || 3000;
    let host;
    let cb;
    if (args.length === 1) {
      port = args[0];
    } else if (args.length === 2) {
      port = args[0];
      cb = args[1];
    } else {
      port = args[0];
      host = args[1];
      cb = args[2];
    }
    this.#server.listen(port, host, cb);
  }
}

export default RestWave;
