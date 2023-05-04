import RestWave from "./index.js";

const app = new RestWave();
app.printMiddlewares();
app.get("/", (req, res) => {
	res.json({ name: " adarsh", last: "shahi", age: 21 }, 400);
});
app.post("/", (req, res) => {
	res.json({ name: " adarsh", last: "shahi", age: 21 }, 500);
});
app.patch("/", (req, res) => {
	res.json({ name: " adarsh", last: "shahi", age: 21 }, 500);
});
app.delete("/", (req, res) => {
	res.json({ name: " adarsh", last: "shahi", age: 21 }, 500);
});
app.listen(5000, () => {
	console.log("server listening on port 5000");
});
