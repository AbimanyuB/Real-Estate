import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const register = async (req, res) => {
  // db operation
  const { username, password, email } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    // Create new User
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      }
    })
    console.log(newUser);
    res.status(201).json({ message: "Succesfully Created a new User!"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to Created a new User!"});
  }
}

export const login = async (req, res) => {
  const { username, password } = req.body;
  // db operation
  console.log('login');
  try {
    // CHECK IF THE USER EXIST
    const user = await prisma.user.findUnique({
      where: { username }
    });
    console.log(user);
    if (!user) return res.status(401).json({ message: "Invalid Credentials"});

    // CHECK IF THE PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid Credentials"});

    // GENERATE COOKIE TOKEN AND SEND IT TO USER
    // 1 Week Cookies Max Age
    const maxAge = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign({
      id: user.id,
      isAdmin: true
    }, process.env.JWT_SECRET_KEY, { expiresIn: maxAge });
    
    const {password: userPassword, ...userInfo} = user;
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true,
      maxAge,
    }).status(200).json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to login"});
  }
}

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful"});
}