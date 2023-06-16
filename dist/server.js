"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const files_1 = __importDefault(require("./routes/files"));
dotenv_1.default.config();
const cloudinary_1 = require("cloudinary");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, express_1.default)());
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_API_CLOUD,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
(0, db_1.default)();
const PORT = process.env.PORT;
app.use('/api/files', files_1.default);
app.listen(PORT, () => console.log(`Server is Up and running on PORT:${PORT}`));
