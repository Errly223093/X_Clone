import express from "express";
import { PrismaClient } from "@prisma/client";
// npm i bcrypt // npm i -D @types/bcrypt
import bcrypt from "bcrypt";

const app = express();
const port = 3010;
const client = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("Hello, Express!");
});

app.post("/user", async (req, res) => {
  try {
    const { account, password } = req.body;

    // 중복 유저 확인
    const existUser = await client.user.findUnique({
      where: {
        account,
      },
    });

    // 유저가 존재할 경우
    if (existUser) {
      return res
        .status(400)
        .json({ ok: false, message: "Already exist user." });
    }

    // bcrypy 사용해서 패스워드 해싱. hashSync => 비동기 해시처리(해싱할 값, 솔팅 횟수)
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 유저 생성
    const newUser = await client.user.create({
      data: {
        account,
        password: hashedPassword,
      },
    });

    console.log(newUser);

    return res.json({
      ok: true,
      user: {
        id: newUser.id,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        account: newUser.account,
      },
    });
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is Listening on Port : ${port}`);
});
