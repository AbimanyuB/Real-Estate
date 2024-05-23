import prisma from "../lib/prisma.js";
import bcyrpt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Users" });
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Users" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenId = req.userId;
  const { password, avatar, ...inputs} = req.body;
  let updatedPass = null;

  if (id !== tokenId) return   res.status(403).json({ message: "Not Authorized" });
  
  try {
    if (password) {
      updatedPass = await bcyrpt.hash(password,10);
    }
    const updateUser = await prisma.user.update({
      where: {id},
      data: {
        ...inputs,
        ...(password && { password: updatedPass }),
        ...(avatar && {avatar})
      }
    })

    const {password: userPassword, ...userResponse} = updateUser
    res.status(200).json(userResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Users" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenId = req.userId;

  if (id !== tokenId) return   res.status(403).json({ message: "Not Authorized" });
  try {
    await prisma.user.delete({
      where: { id }
    })
    res.status(200).json({message: 'User Deleted'})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Users" });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenId = req.userId;

  try {
    const postSaved = await prisma.savedPost.findUnique({
      where: { 
        userId_postId: {
          userId: tokenId,
          postId
        }
      }
    })

    if (postSaved) {
      await prisma.savedPost.delete({
        where: {
          id: postSaved.id
        }
      })
      return res.status(200).json({message: 'Post remove from saved list'})
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenId,
          postId
        }
      })
      return res.status(200).json({message: 'Post saved'})
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Users" });
  }
};

export const profilePosts = async (req, res) => {
  console.log("mashoookkkkk");
  try {
    const tokenId = req.userId
    const posts = await prisma.post.findMany({
      where: { userId: tokenId },
    });
    console.log(posts)
    const savedPosts = await prisma.savedPost.findMany({
      where: { userId: tokenId },
      include: { post: true }
    })
    console.log(savedPosts)
    const mySavedPosts = savedPosts.map(item => item.post);
    res.status(200).json({posts, mySavedPosts});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Profile Post" });
  }
};