import mongoose from 'mongoose';

const progressSnapshotSchema = new mongoose.Schema({
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
  stats: {
    totalProblems: { type: Number, default: 0 },
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
    rating: { type: Number },
    rank: { type: String },
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

progressSnapshotSchema.index({ userId: 1, platform: 1, date: -1 });
progressSnapshotSchema.index({ userId: 1, date: -1 });

const ProgressSnapshot = mongoose.model('ProgressSnapshot', progressSnapshotSchema);

export default ProgressSnapshot;
