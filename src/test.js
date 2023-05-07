import RestWave from "./index.js";

const app = new RestWave();
app.printMiddlewares();
app.get("/", (req, res) => {
	res.json({ name: " adarsh", last: "shahi", age: 21 }, 200);
});
app.post("/", (req, res) => {
	res.json({ name: " adarsh", last: "shahi", age: 21 }, 201);
});
app.patch("/", (req, res) => {
	res.json({ name: " adarsh", last: "shahi", age: 21 }, 203);
});
app.delete("/", (req, res) => {
	res.json({ name: " adarsh", last: "shahi", age: 21 }, 200);
});
app.listen(5000, () => {
	console.log("server listening on port 5000");
});
