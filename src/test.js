import RestWave from "./index.js";
import cors from 'cors'
const app = new RestWave();
app.printMiddlewares();
app.use(cors());
app.get("/", (req, res) => {
	res.json({ name: " adarsh", last: "shahi", age: 21 }, 400);
});
app.post("/", (req, res) => {
   console.log(req.body);
	res.json({ name: " adarsh", last: "shahi", age: 21 }, 500);
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
