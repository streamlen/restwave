import RestWave from "./index.js";

/*
	Examplees
*/
const app = new RestWave();
const routes = RestWave.router();

app.listen(3000, () => {
	console.log(`listeing on port: 3000`);
});

app.get("/user/:id/ok/:uid", (req, res) => {
	console.log("id: " + req.params.id);
	console.log("uid " + req.params.uid);
	res.json({ name: "shahi" });
});

app.use("/:id/:uid", (req, res, next) => {
	console.log("id" + req.params.id);
	console.log("uid" + req.params.uid);
	// res.json("adsfads");
	next();
});

routes.get("/bye", (req, res) => {
	console.log("in bye");
	res.json("hey there");
});

routes.route("/omkay").post(() => {});

app.use("/bro", routes);

app.use((req, res) => {
	res.json("Handle vague endpoints");
});

// console.log(router.isGetCalled());
// app.use(router);
