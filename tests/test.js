import RestWave from "../src/index.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = new RestWave();
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/test-data/video.mp4");
});
// app.route("/sike").put((req, res) => {
// 	res.json("in put ");
// });

// const router = RestWave.router();

// router.route("/r").put((req, res) => {
// 	res.json("in route put");
// });

// app.use(router);

// app.post("/", (req, res) => {
// 	res.json({ name: " adarsh", last: "shahi", age: 21 }, 201);
// });
// app.patch("/", (req, res) => {
// 	res.json({ name: " adarsh", last: "shahi", age: 21 }, 203);
// });
// app.delete("/", (req, res) => {
// 	res.json({ name: " adarsh", last: "shahi", age: 21 }, 200);
// });
app.printMiddlewares();
app.listen(5000, () => {
	console.log("server listening on port 5000");
});
