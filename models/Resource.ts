import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IResource extends Document {
  url: string;
  title: string;
  description: string;
  image: string;
  domain: string;
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
  },
  { timestamps: true }
);

// Prevent re-compilation of the model if it already exists
const Resource: Model<IResource> =
  mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);

export default Resource;
