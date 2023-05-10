import RestWave from "./index.js";
const app = new RestWave();
app.route("/sike").put((req, res) => {
  res.json("in put ");
});

const router = RestWave.router();

router.route("/r").put((req, res) => {
  res.json("in route put");
});

app.use(router);

app.get("/", (req, res) => {
  const htmlString = '<?xml version="1.0" encoding="UTF-8"?><><element>Content</element>';
  res.send(htmlString,201);
});
app.patch("/", (req, res) => {
  res.json({ name: " adarsh", last: "shahi", age: 21 }, 203);
});
app.delete("/", (req, res) => {
  res.json({ name: " adarsh", last: "shahi", age: 21 }, 500);
});
app.printMiddlewares();
app.listen(2000, () => {
  console.log("server listening on port 2000");
});
