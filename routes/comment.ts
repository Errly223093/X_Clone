import express from "express";
import { PrismaClient } from "@prisma/client";

import { verifyToken } from "./auth";

const router = express.Router();

const client = new PrismaClient();

const select = {
  id: true,
  content: true,
  createdAt: true,
  userId: true,
  user: {
    select: {
      account: true,
    },
  },
  postId: true,
  post: {
    select: {
      content: true,
    },
  },
};

router.post("/", verifyToken, async (req: any, res) => {
  try {
    const { content, postId } = req.body;
    const { account } = req;

    if (!content || content.trim().length === 0 || !postId) {
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

    const existPost = await client.post.findUnique({
      where: {
        id: +postId,
      },
    });

    if (!existPost) {
      return res.status(400).json({
        ok: false,
        message: "Not exist post.",
      });
    }

    const comment = await client.comment.create({
      data: {
        content,
        userId: user.id,
        postId: existPost.id,
      },
      select,
    });

    return res.json({ ok: true, comment });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

export default router;
