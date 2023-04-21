import { Velocity, Router } from "./index.js";

/*
	Examplees
*/

const app = new Velocity();

app.listen(5000, () => {
	console.log(`listeing on port: 5000`);
});

app.use((req, res, next) => {
	console.log("he there");
	// res.json("adsfads");
	next();
});

const router3 = new Router();

router3.get("/edit", (req, res) => {
	res.json("hey there");
});

router3
	.route("/ok")
	.get((req, res) => {
		res.json("from route get");
	})
	.patch((req, res) => {
		res.json("from route patch");
	})
	.post((req, res) => {
		res.json("from route post");
	})
	.delete((req, res) => {
		res.json("from route delete");
	});

app.use("/sike", router3);

// console.log(router.isGetCalled());
// app.use(router);
