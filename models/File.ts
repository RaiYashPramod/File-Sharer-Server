import mongoose,{Document} from "mongoose";

const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    fileName: {
      type: String,
      require: true,
    },
    secure_url: {
      type: String,
      require: true,
    },
    format: {
      type: String,
      require: true,
    },
    sizeInBytes: {
      type: String,
      require: true,
    },
    sender: {
      type: String,
    },
    receiver: {
      type: String,
    },
  }
);

interface IFile extends Document {
  fileName: string;
  secure_url: string;
  format: string;
  sizeInBytes: string;
  sender?: string;
  receiver?: string;
}

export default mongoose.model<IFile>("File", fileSchema);