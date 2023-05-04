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

#### Are you tired of boring, easy-to-use frameworks that don't give you a headache? Look no further than RestWave! With RestWave, you'll learn all about web development while simultaneously tearing your hair out!

## Installation

This is a Node.js module available through the npm registry.

Before installing, download and install Node.js. Node.js 0.10 or higher is required.

If this is a brand new project, make sure to create a package.json first with the ```npm init``` command.

Installation is done using the ```npm install``` command:

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

