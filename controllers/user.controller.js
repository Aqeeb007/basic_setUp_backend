import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import db from '../DB/index.js';
import bcrypt from 'bcrypt';

const generateAccessTokens = async (userId) => {
  try {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });

    return accessToken;
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating access token'
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if ([email, password].some((field) => field?.trim() === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existedUser) {
    throw new ApiError(409, 'User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      email,
      role,
      password: hashedPassword,
    },
  });

  const { password: extractedPassword, ...userData } = user;
  console.log('extractedPassword: ', extractedPassword);

  if (!user) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  return res
    .status(201)
    .json(new ApiResponse(200, userData, 'User registered Successfully'));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    throw new ApiError(400, 'username is required');
  }

  const user = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  const accessToken = await generateAccessTokens(user.id);

  const { password: extractedPassword, ...userData } = user;
  console.log('extractedPassword: ', extractedPassword);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: userData,
          accessToken,
        },
        'User logged In Successfully'
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .json(new ApiResponse(200, {}, 'User logged Out'));
});

export { registerUser };
