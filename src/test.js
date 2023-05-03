import RestWave from "./index.js";

/*
	Examplees
*/
const app = new RestWave();
const routes = RestWave.router();
const routes2 = RestWave.router();
const router = RestWave.router();

app.listen(2000, () => {
	console.log(`listeing on port: 2000`);
});

app.printMiddlewares();
// app.get("/user/:id/ok/:uid", (req, res) => {
// 	console.log("id: " + req.params.id);
// 	console.log("uid " + req.params.uid);
// 	res.json({ name: "shahi" });
// });

// app.use("/:id/:uid", (req, res, next) => {
// 	console.log("id" + req.params.id);
// 	console.log("uid" + req.params.uid);
// 	// res.json("adsfads");
// 	next();
// });

function middleware1(req,res,next){
    console.log("u are in middleware 1");
    next();
}

routes.get("/bye", middleware1,(req, res) => { // this is an example where middlewares can be added before callback
	console.log("in bye");
	res.json("hey there");
});

routes.get("/hi", (req, res) => {
	console.log("in hi");
	res.json("hey there i am in hi");
});

routes2.get("/hibro", (req, res) => {
	console.log("in hi");
	res.json("hey there i am in hibro");
});

app
	.route("/adarsh")
	.post(() => {})
	.get(() => {})
	.delete(() => {});

router
	.route("/omkay")
	.post(() => {})
	.get(() => {})
	.delete(() => {});

app.use("/first", routes,routes2,(req,res)=>{ //this is the new functionality that i have iintroduced in this software , where u can include multiple routes and a callback .
 res.json('bro bro bro');
});

app.use(router); // here routes are been handled without any prefixed route .
