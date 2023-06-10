import connectDb from "./db";

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import fileRoutes from './routes/files'
dotenv.config();

import {v2 as cloudinary} from 'cloudinary'

const app = express();
app.use(cors());
app.use(express())

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})


connectDb();

const PORT = process.env.PORT;

app.use('/api/files', fileRoutes);

app.listen(PORT, () => console.log(`Server is Up and running on PORT:${PORT}`));