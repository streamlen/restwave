import Router from "../router/router.js";

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
  printMiddlewares() {
    console.log(this.getMiddlewares());
  }
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
    } else {
      for (let i = 1; i < args.length; i++) {
        if (args[i] instanceof Router) {
          args[i].getRoutingMiddlewares().forEach((routingMiddleware) => {
            this.#addMiddlewares(
              routingMiddleware.method,
              args[0] + routingMiddleware.route,
              routingMiddleware.cb
            );
          });
        } else {
          this.#addMiddlewares("ANY", args[0], args[i]);
        }
      }
    }
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

  put(route, cb) {
    this.#addMiddlewares("PUT", route, cb);
  }

  /**
   * Return the list of total middlewares.
   * @returns {Object[]} An array of middleware objects containing method, route, and cb properties.
   */
  getMiddlewares() {
    return [...this.#totalMiddlewares];
  }

  static router() {
    return new Router();
  }

  route(path) {
    const router = new Router();
    router.route(path, this);
    return router;
  }
}

export default Methods;
