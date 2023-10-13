import express, { NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface JwtPayload {
  account: string;
}

const client = new PrismaClient();
const router = express.Router();

// 로그인
router.post("/", async (req, res) => {
  try {
    const { account, password } = req.body;

    if (!account || !password) {
      return res.status(400).json({
        ok: false,
        message: "Not exist data.",
      });
    }

    const user = await client.user.findUnique({
      where: {
        account,
      },
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "Not exist user.",
      });
    }

    const comparePassword = bcrypt.compareSync(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({
        ok: false,
        message: "Incorrect password.",
      });
    }

    const token = jwt.sign({ account }, process.env.JWT_SECRET_KEY!);

    return res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

export const verifyToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.substring(7);

    if (!token) {
      return res.status(400).json({
        ok: false,
        message: "Not exist token.",
      });
    }

    const { account } = (await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    )) as JwtPayload;

    req.account = account;

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
};

export default router;
