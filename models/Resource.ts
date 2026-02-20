import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  url: string;
  title: string;
  description: string;
  image: string;
  domain: string;
  addedBy?: {
    name: string;
    image: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const ResourceSchema: Schema<IResource> = new Schema(
  {
    url: {
      type: String,
      required: [true, 'Please provide a URL.'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    domain: {
      type: String,
      default: '',
    },
    addedBy: {
      name: { type: String, required: true },
      image: { type: String, required: true },
      email: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export default mongoose.models.Resource || mongoose.model<IResource>("Resource", ResourceSchema);
