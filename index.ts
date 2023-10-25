import express from "express";
import userRouter from "./routes/user";
import authRouter, { verifyToken } from "./routes/auth";
import postRouter from "./routes/post";

const app = express();
const port = 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);

app.get("/", (req, res) => {
  res.send("Hello, ExpressTS!");
});

app.post("/test", verifyToken, (req: any, res) => {
  // verify 로 미들웨어 처리가 끝나야 req, res 로 넘어감
  console.log(req.account);

  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`🚀 Server is listening on port: ${port}`);
});
