# RestWave

### Simplified version of express

<p>

<a href="https://npmjs.org/package/restwave" rel="nofollow">
  <img src="https://badgen.net/npm/v/restwave" alt="NPM Version" data-canonical-src="https://badgen.net/npm/v/restwave" style="max-width: 100%;">
</a>

<a href="https://packagephobia.com/result?p=restwave" rel="nofollow">
  <img src="https://badgen.net/packagephobia/install/restwave" alt="NPM Install Size" data-canonical-src="https://badgen.net/packagephobia/install/restwave" style="max-width: 100%;">
</a>

<a href="https://npmcharts.com/compare/restwave?minimal=true" rel="nofollow">
  <img src="https://badgen.net/npm/dm/restwave" alt="NPM Downloads" data-canonical-src="https://badgen.net/npm/dm/restwave" style="max-width: 100%;">
</a>

</p>

### Introducing our custom-built TCP server (built upon node net module) framework designed to handle incoming HTTP requests and responses, with a primary focus on JSON data. This framework provides a lightweight alternative to traditional HTTP servers, allowing for faster communication and more efficient data transmission. By utilizing the TCP protocol, this framework is well-suited for real-time applications that require low latency and high performance. With its user-friendly interface and flexible architecture, this framework provides developers with a simple yet powerful tool for building custom APIs and web services. By handling incoming requests and responses as JSON data, this framework allows developers to easily communicate with other systems and services, making it an ideal solution for building modern, data-driven applications. Whether you are building a simple API or a complex web service, this TCP server framework is the perfect solution for handling your HTTP requests and responses with ease and efficiency.

## Usage

With this framework, developers can easily define their server routes and handlers, create middleware, and respond to JSON data requests with ease. The framework provides a simplified request and response object, making it easy to parse and manipulate JSON data.

This TCP server framework is perfect for building scalable, high-performance server applications that handle JSON data requests and responses with ease. Whether you're building a RESTful API or a real-time application, this framework offers the tools you need to get the job done quickly and efficiently.

If you're looking for a lightweight, fast, and powerful TCP server framework that specializes in handling JSON data, this is the perfect choice for you.

## Installation

This is a Node.js module available through the npm registry.

Before installing, download and install Node.js. Node.js 0.10 or higher is required.

If this is a brand new project, make sure to create a package.json first with the `npm init` command.

Installation is done using the `npm install` command:

```bash
$ npm install restwave
```

# Basic Example of how u can start with RestWave

```bash
import RestWave from 'restwave';
const app = new RestWave();

app.get('/',(req,res)=>{
   res.json("hello world");
});

app.listen(3000);
```

This app starts a server and listens on port 3000 for connections. The app responds with “hello world” for requests to the root URL (/) or route. For every other path, it will respond with a 404 Not Found.