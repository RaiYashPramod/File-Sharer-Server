"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const File_1 = __importDefault(require("../models/File"));
const https_1 = __importDefault(require("https"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({});
let upload = (0, multer_1.default)({
    storage,
});
router.post("/upload", upload.single("myfile"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file)
            return res.status(400).json({ message: "No File" });
        console.log(req.file);
        let uploadedFile;
        try {
            uploadedFile = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                folder: "SharedFiles",
                resource_type: "auto",
            });
        }
        catch (error) {
            console.log(error.message);
            return res.status(400).json({ message: "No File(Clodinary)" });
        }
        const { originalname } = req.file;
        const { secure_url, format, bytes } = uploadedFile;
        const file = yield File_1.default.create({
            fileName: originalname,
            sizeInBytes: bytes,
            secure_url,
            format,
        });
        return res.status(200).json({
            id: file._id,
            downloadPageLink: `${process.env.API_BASE_ENDPOINT_CLIENT}download/${file._id}`,
            secure_url,
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const file = yield File_1.default.findById(id);
        if (!file) {
            return res
                .status(404)
                .json({ message: "The Link is Invalid! No file exists here!!" });
        }
        const { fileName, sizeInBytes, format } = file;
        return res.status(200).json({
            name: fileName,
            sizeInBytes,
            format,
            id,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}));
router.get("/:id/download", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const file = yield File_1.default.findById(id);
        if (!file) {
            return res
                .status(404)
                .json({ message: "The Link is Invalid! No file exists here!" });
        }
        https_1.default.get(file.secure_url, (fileStream) => {
            fileStream.pipe(res);
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}));
exports.default = router;
