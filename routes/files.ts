import express from "express";
import multer from "multer";
import {UploadApiResponse, v2 as cloudinary} from 'cloudinary'
import File from "../models/File";

const router = express.Router();

const storage = multer.diskStorage({});

let upload = multer({
  storage
})

router.post('/upload', upload.single('myfile') ,async (req, res) => {
  try {
    if(!req.file) 
      return res.status(400).json({message: "No File"})
    console.log(req.file);
    let uploadedFile:UploadApiResponse;
    try{
      uploadedFile = await cloudinary.uploader.upload(req.file.path,{
        folder: 'SharedFiles',
        resource_type: "auto"
      })
    } catch(error){
      console.log((error as Error).message)
      return res.status(400).json({message: "No File(Clodinary)"})
      
    }
    const {originalname} = req.file;
    const {secure_url,format,bytes} = uploadedFile;

    const file = await File.create({
      fileName: originalname,
      sizeInBytes: bytes,
      secure_url,
      format 
    })

    return res.status(200).json({
      id: file._id,
      downloadPageLink: `${process.env.API_BASE_ENDPOINT_CLIENT}/download/${file._id}`
    })
  } catch (error) {
    console.log((error as Error).message)
    res.status(500).json({message: "Server Error"})
  }
})

export default router;
