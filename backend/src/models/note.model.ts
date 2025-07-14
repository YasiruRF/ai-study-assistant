import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  subject: string;
  fileUrl?: string;
  fileType?: string;
  summary?: string;
  user: mongoose.Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      trim: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'image', 'text', 'other'],
    },
    summary: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Create text index for search functionality
NoteSchema.index({ title: 'text', content: 'text', subject: 'text', tags: 'text' });

const Note = mongoose.model<INote>('Note', NoteSchema);

export default Note;