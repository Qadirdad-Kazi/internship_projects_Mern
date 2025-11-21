import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxLength: [1000, 'Description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxLength: [200, 'Short description cannot exceed 200 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    enum: [
      'Programming',
      'Web Development',
      'Data Science',
      'Machine Learning',
      'Mobile Development',
      'DevOps',
      'UI/UX Design',
      'Business',
      'Marketing',
      'Other'
    ]
  },
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  pricing: {
    type: {
      type: String,
      enum: ['free', 'paid', 'premium'],
      required: true
    },
    amount: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR']
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative']
    },
    discountExpiry: Date
  },
  thumbnail: {
    url: String,
    public_id: String
  },
  preview: {
    url: String,
    public_id: String,
    duration: Number
  },
  lessons: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    content: {
      type: String,
      required: true
    },
    duration: {
      type: Number, // in minutes
      required: true
    },
    video: {
      url: String,
      public_id: String
    },
    resources: [{
      title: String,
      url: String,
      type: {
        type: String,
        enum: ['pdf', 'zip', 'link', 'image']
      }
    }],
    isPreview: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      required: true
    }
  }],
  requirements: [String],
  whatYouWillLearn: [String],
  tags: [String],
  language: {
    type: String,
    default: 'English'
  },
  duration: {
    type: Number, // Total duration in minutes
    default: 0
  },
  studentsEnrolled: {
    type: Number,
    default: 0
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxLength: [500, 'Review cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  certificate: {
    enabled: {
      type: Boolean,
      default: true
    },
    template: String
  }
}, {
  timestamps: true
});

// Index for search functionality
courseSchema.index({
  title: 'text',
  description: 'text',
  shortDescription: 'text',
  tags: 'text'
});

// Virtual for effective price
courseSchema.virtual('effectivePrice').get(function() {
  if (this.pricing.discountPrice && 
      this.pricing.discountExpiry && 
      this.pricing.discountExpiry > new Date()) {
    return this.pricing.discountPrice;
  }
  return this.pricing.amount;
});

// Virtual for discount percentage
courseSchema.virtual('discountPercentage').get(function() {
  if (this.pricing.discountPrice && this.pricing.amount > 0) {
    return Math.round(((this.pricing.amount - this.pricing.discountPrice) / this.pricing.amount) * 100);
  }
  return 0;
});

// Method to check if course is accessible to user
courseSchema.methods.isAccessibleTo = function(user) {
  // Free courses are accessible to everyone
  if (this.pricing.type === 'free') return true;
  
  // Premium courses require premium subscription
  if (this.pricing.type === 'premium') {
    return user && user.hasPremiumAccess();
  }
  
  // Paid courses require purchase or premium subscription
  if (this.pricing.type === 'paid') {
    return user && (user.ownsCourse(this._id) || user.hasPremiumAccess());
  }
  
  return false;
};

// Calculate total duration from lessons
courseSchema.pre('save', function(next) {
  if (this.lessons && this.lessons.length > 0) {
    this.duration = this.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
  }
  next();
});

// Update ratings when reviews change
courseSchema.methods.updateRatings = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average = Number((totalRating / this.reviews.length).toFixed(2));
    this.ratings.count = this.reviews.length;
  }
};

courseSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model('Course', courseSchema);