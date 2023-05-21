import RestWave from "../src/index.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

class AppError extends Error {
  constructor(payload, statusCode) {
    const data = JSON.stringify(payload);
    super(data);
    this.statusCode = statusCode;
    this.payload = payload;
    this.status = statusCode >= 500 ? "error" : "fail";
  }
}


const errorController = async (err, req, res, next) => {
  res.json(
    {
      status: err.status,
      payload: err.payload,
    },
    err.statusCode
  );
  next(err);
};

const app = new RestWave();
app.get("/", (req, res, next) => {
   try{
    throw new AppError("hey fucker", 500);
    res.json("connected");
   }catch(err){
      next(err);
   }
});

app.use(errorController);
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
app.listen(3000, () => {
  console.log("server listening on port 3000");
});
