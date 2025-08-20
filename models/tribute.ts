import mongoose, { Schema, type Document } from "mongoose"

export interface ITribute extends Document {
  _id: string
  userId: mongoose.Types.ObjectId
  fullName: string
  dateOfBirth: Date
  dateOfDeath: Date
  placeOfBirth?: string
  placeOfDeath?: string
  causeOfDeath?: string
  biography?: string
  epitaph?: string
  mainPortrait?: {
    url: string
    publicId: string
  }
  imageGallery: Array<{
    url: string
    publicId: string
    caption?: string
  }>
  familyTree: Array<{
    name: string
    relationship: string
    dateOfBirth?: Date
    dateOfDeath?: Date
    isDeceased?: boolean
  }>
  memorialServices: Array<{
    type: string
    venue: string
    address?: string
    date: Date
    time?: string
    description?: string
  }>
  burialServices: Array<{
    type: string
    venue: string
    address?: string
    date: Date
    time?: string
    description?: string
  }>
  donationRequests: Array<{
    organizationName: string
    description?: string
    contactInfo?: string
    website?: string
  }>
  publisher: {
    name: string
    relationship: string
    contactInfo?: string
  }
  paymentSubscription: {
    years: number
    totalAmount: number
    paymentStatus: "pending" | "completed" | "failed"
    paymentDate?: Date
    expirationDate: Date
  }
  status: "draft" | "pending" | "approved" | "published" | "rejected"
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
}

const TributeSchema = new Schema<ITribute>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    dateOfDeath: {
      type: Date,
      required: true,
    },
    placeOfBirth: {
      type: String,
      trim: true,
    },
    placeOfDeath: {
      type: String,
      trim: true,
    },
    causeOfDeath: {
      type: String,
      trim: true,
    },
    biography: {
      type: String,
      trim: true,
    },
    epitaph: {
      type: String,
      trim: true,
    },
    mainPortrait: {
      url: String,
      publicId: String,
    },
    imageGallery: {
      type: [
        {
          url: String,
          publicId: String,
          caption: String,
        },
      ],
      default: [],
    },
    familyTree: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          relationship: {
            type: String,
            required: true,
          },
          dateOfBirth: Date,
          dateOfDeath: Date,
          isDeceased: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },
    memorialServices: {
      type: [
        {
          type: {
            type: String,
            required: true,
          },
          venue: {
            type: String,
            required: true,
          },
          address: String,
          date: {
            type: Date,
            required: true,
          },
          time: String,
          description: String,
        },
      ],
      default: [],
    },
    burialServices: {
      type: [
        {
          type: {
            type: String,
            required: true,
          },
          venue: {
            type: String,
            required: true,
          },
          address: String,
          date: {
            type: Date,
            required: true,
          },
          time: String,
          description: String,
        },
      ],
      default: [],
    },
    donationRequests: {
      type: [
        {
          organizationName: {
            type: String,
            required: true,
          },
          description: String,
          contactInfo: String,
          website: String,
        },
      ],
      default: [],
    },
    publisher: {
      name: {
        type: String,
        required: true,
      },
      relationship: {
        type: String,
        required: true,
      },
      contactInfo: String,
    },
    paymentSubscription: {
      years: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      paymentDate: Date,
      expirationDate: {
        type: Date,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "published", "rejected"],
      default: "draft",
    },
    rejectionReason: String,
  },
  {
    timestamps: true,
  },
)

// Virtual for getting all images
TributeSchema.virtual("images").get(function () {
  const imageGallery = this.imageGallery || []
  const mainPortrait = this.mainPortrait

  if (mainPortrait) {
    return [mainPortrait, ...imageGallery]
  }
  return imageGallery
})

// Set expiration date based on payment years
TributeSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("paymentSubscription.years")) {
    const expirationDate = new Date()
    expirationDate.setFullYear(expirationDate.getFullYear() + this.paymentSubscription.years)
    this.paymentSubscription.expirationDate = expirationDate
  }
  next()
})

// Index for efficient queries
TributeSchema.index({ userId: 1, status: 1 })
TributeSchema.index({ status: 1, createdAt: -1 })
TributeSchema.index({ "paymentSubscription.expirationDate": 1 })

export default mongoose.models.Tribute || mongoose.model<ITribute>("Tribute", TributeSchema)
