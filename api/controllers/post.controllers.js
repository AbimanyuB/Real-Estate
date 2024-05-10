import prisma from "../lib/prisma.js";
import bcyrpt from "bcrypt";

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Posts" });
  }
};

export const getPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true
          }
        },
      }
    });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Post" });
  }
};

export const addPost = async (req, res) => {
  const tokenId = req.userId;
  const body = req.body;
  
  try {
    const createPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenId,
        postDetail: {
          create: body.postDetail
        }
      }
    })
    res.status(200).json(createPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create Post" });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const tokenId = req.userId;
  const { img, ...inputs} = req.body;
  
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== tokenId) return   res.status(403).json({ message: "Not Authorized" });

    const updateUser = await prisma.post.update({
      where: {id},
      data: {
        ...inputs,
        ...(img && {img})
      }
    })

    res.status(200).json(updateUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update Post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== tokenId) return   res.status(403).json({ message: "Not Authorized" });
    
    await prisma.post.delete({
      where: { id }
    })

    res.status(200).json({message: 'Post Deleted'})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete Post" });
  }
};
