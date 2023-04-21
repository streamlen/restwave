import { RestWave, Router } from "./index.js";

/*
	Examplees
*/

const app = new RestWave();

app.listen(5000, () => {
	console.log(`listeing on port: 5000`);
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

const router = new Router();

router.patch("/:postId/sike", (req, res) => {
	res.json({ name: "adarsh" });
});
router.post("/:postId/sike", (req, res) => {
	res.json({ name: "adarsh" });
});
app.use("/admin/:id", router);

const router3 = new Router();

router3.get("/edit/:hmm", (req, res) => {
	res.json("hey there");
});

router3
	.route("/ok/:id")
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

app.use((req, res) => {
	res.json("Handle vague endpoints");
});

// console.log(router.isGetCalled());
// app.use(router);
