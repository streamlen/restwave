import RestWave from "./index.js";

/*
	Examplees
*/
const app = new RestWave();
const routes = RestWave.router();

app.listen(3000, () => {
	console.log(`listeing on port: 3000`);
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

routes.get("/bye", middleware1,(req, res) => {
	console.log("in bye");
	res.json("hey there");
});

routes.get("/hi", (req, res) => {
	console.log("in hi");
	res.json("hey there i am in hi");
});

// routes.route("/omkay").post(() => {});

// app.use("/bro", routes);
app
	.route("/adarsh")
	.post(() => {})
	.get(() => {})
	.delete(() => {});

const router = RestWave.router();
router
	.route("/omkay")
	.post(() => {})
	.get(() => {})
	.delete(() => {});

app.use("/first", routes);

app.patch("/edit", (req, res) => {});
app.get("/edit", (req, res) => {});
// app.use((req, res) => {
// 	res.json("Handle vague endpoints");
// });

// console.log(router.isGetCalled());
// app.use(router);
