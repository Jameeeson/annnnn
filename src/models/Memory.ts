import mongoose from 'mongoose';

export interface IMemory extends mongoose.Document {
  imageUrl: string;
  caption: string;
  tag?: string;
  createdAt: Date;
}

const MemorySchema = new mongoose.Schema<IMemory>({
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image url or base64 string'],
  },
  caption: {
    type: String,
    required: [true, 'Please provide a caption'],
    maxlength: [500, 'Caption cannot be more than 500 characters'],
  },
  tag: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Memory || mongoose.model<IMemory>('Memory', MemorySchema);
