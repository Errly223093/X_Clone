import express from "express";
import { verifyToken } from "./auth";
import { PrismaClient } from "@prisma/client";

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
};

// 글 작성
router.post("/", verifyToken, async (req: any, res) => {
  try {
    const { content } = req.body;
    const { account } = req;

    if (!content || content.trim().length === 0 /* 공백만 있다면 x */) {
      return res.status(400).json({
        ok: false,
        message: "Not exist content",
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

    const post = await client.post.create({
      data: {
        content,
        userId: user.id,
      },
    });

    res.json({ ok: true, post });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

// 글 읽기
router.get("/", async (req, res) => {
  try {
    const { page } = req.query;

    if (!page) {
      return res.status(400).json({
        ok: false,
        message: "Not exist page.",
      });
    }

    const posts = await client.post.findMany({
      select,
    });

    if (posts.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Not exist Posts.",
      });
    }

    return res.json({ ok: false, posts });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "Not exist data.",
      });
    }

    const post = await client.post.findUnique({
      where: {
        id: +id,
      },
      select,
    });

    console.log(post);

    if (!post) {
      return res.status(400).json({
        ok: false,
        message: "Not exist data",
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { page } = req.query;

    if (!userId || !page) {
      return res.status(400).json({
        ok: false,
        message: "Not exist data.",
      });
    }

    const posts = await client.post.findMany({
      where: {
        userId: +userId,
      },
      skip: +page * 3,
      take: 3,
      select,
      orderBy: {
        id: "desc",
      },
    });

    if (posts.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Server error.",
      });
    }

    return res.json({ ok: true, posts });
  } catch (error) {
    console.error(error);
  }
});

export default router;
