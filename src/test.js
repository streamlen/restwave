import RestWave from "./index.js";
const app = new RestWave();
app.printMiddlewares();
app.get("/", (req, res) => {
	res.send({ name: " adarsh", last: "shahi", age: 21 }, 500);
});
app.post("/", (req, res) => {
   console.log(req.body);
   const bufferData = Buffer.from({ name: " adarsh", last: "shahi", age: 21 });
	res.send(bufferData, 500);
});
app.patch("/", (req, res) => {
	res.json({ name: " adarsh", last: "shahi", age: 21 }, 500);
});
app.delete("/", (req, res) => {
	res.json({ name: " adarsh", last: "shahi", age: 21 }, 500);
});
app.listen('3000', () => {
	console.log("server listening on port 3000");
});
