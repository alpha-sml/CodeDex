import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  platform: {
    type: String,
    enum: ['leetcode', 'codeforces'],
    required: true,
  },
  problemId: {
    type: String,
    required: true,
  },
  problemName: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'unknown'],
    default: 'unknown',
  },
  url: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

bookmarkSchema.index({ userId: 1, platform: 1, problemId: 1 }, { unique: true });
bookmarkSchema.index({ userId: 1, difficulty: 1 });
bookmarkSchema.index({ userId: 1, platform: 1 });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
