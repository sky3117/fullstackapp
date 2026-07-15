import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: Number,
      required: true,
      min: 0
    },
    url: {
      type: String,
      trim: true
    }
  },
  { _id: false }
)

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true
    },
    platforms: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'At least one platform must be selected.'
      }
    },
    media: {
      type: [mediaSchema],
      default: []
    },
    validationSnapshot: {
      type: Object,
      default: null
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

const Post = mongoose.models.Post || mongoose.model('Post', postSchema)

export default Post
