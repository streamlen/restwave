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

## **Welcome to Restwave, a robust and feature-rich backend web application framework specifically designed for effortlessly building RESTful APIs with Node.js. Built upon TCP server using the Node.js net module, Restwave empowers developers to create high-performance API endpoints with ease.**
#
### **Features**

- **Built-in CORS support**: Restwave offers built-in CORS (Cross-Origin Resource Sharing) handling, eliminating the need for an external library like cors in Express. It automatically handles the necessary headers and options, simplifying cross-origin request management and saving time during API development. Restwave ensures seamless cross-origin access control for your APIs without the hassle of additional configuration.

- **Effortless API Development**: Restwave simplifies the process of creating RESTful APIs by providing a well-structured framework that takes care of common tasks, allowing you to focus on building your core application logic.

- **High Performance**: Leveraging the power of the TCP server, Restwave ensures exceptional performance and scalability, enabling your APIs to handle a large number of simultaneous connections and requests efficiently.

- **Flexible Routing**: With Restwave's flexible routing system, you can easily define your API routes, including support for dynamic parameters, query parameters, middleware, and more. It provides a clean and intuitive interface for defining endpoints and handling HTTP methods.

- **Middleware Support**: Restwave offers middleware support to help you handle authentication, request validation, error handling, and other cross-cutting concerns. Easily plug in your middleware functions to add custom logic at various stages of the request-response lifecycle.

- **Extensibility**: Restwave is designed to be extensible, allowing you to integrate additional plugins, modules, or your own custom components seamlessly. Tailor the framework to your specific needs while leveraging the existing powerful functionality.

#

## **Getting Started**

Follow these steps to quickly set up and start using Restwave for building your RESTful APIs:

_Prerequisites_

Before getting started, make sure you have the following installed:

- Node.js (version 12 or higher)
- npm (Node Package Manager)

Installtion

```
npm install restwave
```

### **Creating Your Own API**

```js
import RestWave from "restwave";
const app = new RestWave();

const PORT = 9000;

app.get((req, res) => {
	res.send("This is my API endpoint.", 200);
});

app.listen(PORT, () => {
	cosnole.log(`Listening to ${PORT}....`);
});
```

#

### **Response Methods**

The res object in Restwave provides several methods for sending responses back to the client. Here are the supported methods:

1. **res.json(data)**

   - `Description`: Sends a JSON response to the client.
   - `Accepts`: A JavaScript object or a string in JSON format.
   - `Example`:

   ```js
   res.json({ message: "Success", data: { name: "John", age: 30 } });
   ```

2. **res.send(data)**
   - `Description`: Sends a general response to the client.
   - `Accepts`: A string or various types of data, including XML, SVG, HTML, text-based formats (e.g., CSS, SCG, plain text), etc. The data should be in string format.
   - `Example`:
   ```js
   res.send("<h1>Welcome to my website!</h1>");
   ```
3. **res.sendFile(path)**

   - `Description`: Sends a file as the response to the client.
   - `Accepts`: The pathname of a file to be sent. Supported file types include CSS, PNG, JPEG/JPG, HTML, GIF, MP4, JS, JSON, PDF, etc.
   - `Example`:

   ```js
   res.sendFile("/path/to/myfile.html");
   ```

It's important to note that the res.json() and res.send() methods automatically set the appropriate Content-Type header based on the data being sent, while res.sendFile() relies on the file extension to determine the Content-Type.

# 

## **Contributing**

We welcome contributions from the developer community to make Restwave even better. To contribute, please review our Contribution Guidelines. Whether you want to report a bug, propose new features, or submit pull requests, your involvement is highly appreciated.

## **License**

Restwave is open-source and released under the MIT License. Feel free to use, modify, and distribute it as per the terms of the license.

## **Contact**
[Twitter](https://twitter.com/streamlen)

For any inquiries or feedback, please reach out to us at contact.restwave@gmail.com We'd love to hear from you!

Start building powerful RESTful APIs with Restwave today and experience the joy of efficient backend development with Node.js!
