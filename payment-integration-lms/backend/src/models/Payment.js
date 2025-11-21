import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  type: {
    type: String,
    enum: ['course_purchase', 'subscription', 'subscription_renewal'],
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['paypal', 'stripe'],
    required: true
  },
  paymentGateway: {
    paymentId: {
      type: String,
      required: true
    },
    payerId: String,
    sessionId: String,
    subscriptionId: String,
    customerId: String
  },
  amount: {
    value: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative']
    },
    currency: {
      type: String,
      required: true,
      default: 'USD'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  metadata: {
    subscriptionPlan: {
      type: String,
      enum: ['basic', 'premium']
    },
    duration: {
      type: Number // in months
    },
    refundReason: String,
    failureReason: String,
    webhookId: String
  },
  transactionFee: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  refund: {
    refunded: {
      type: Boolean,
      default: false
    },
    refundId: String,
    refundAmount: Number,
    refundedAt: Date,
    refundReason: String
  },
  webhook: {
    received: {
      type: Boolean,
      default: false
    },
    receivedAt: Date,
    eventType: String
  }
}, {
  timestamps: true
});

// Index for faster queries
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ 'paymentGateway.paymentId': 1 });
paymentSchema.index({ 'paymentGateway.subscriptionId': 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for payment reference
paymentSchema.virtual('reference').get(function() {
  return `PAY-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Method to mark payment as completed
paymentSchema.methods.markCompleted = function() {
  this.status = 'completed';
  this.webhook.received = true;
  this.webhook.receivedAt = new Date();
};

// Method to mark payment as failed
paymentSchema.methods.markFailed = function(reason) {
  this.status = 'failed';
  this.metadata.failureReason = reason;
};

// Method to process refund
paymentSchema.methods.processRefund = function(refundAmount, reason) {
  this.refund.refunded = true;
  this.refund.refundAmount = refundAmount;
  this.refund.refundedAt = new Date();
  this.refund.refundReason = reason;
  
  if (refundAmount >= this.amount.value) {
    this.status = 'refunded';
  }
};

// Static method to find payments by user
paymentSchema.statics.findByUser = function(userId, status = null) {
  const query = { user: userId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('course', 'title pricing thumbnail')
    .sort({ createdAt: -1 });
};

// Static method to get payment statistics
paymentSchema.statics.getStats = function(startDate, endDate) {
  const matchStage = {
    status: 'completed',
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  };

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        totalAmount: { $sum: '$amount.value' },
        totalTransactions: { $sum: 1 },
        paypalTransactions: {
          $sum: {
            $cond: [{ $eq: ['$paymentMethod', 'paypal'] }, 1, 0]
          }
        },
        stripeTransactions: {
          $sum: {
            $cond: [{ $eq: ['$paymentMethod', 'stripe'] }, 1, 0]
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

paymentSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    // Don't expose sensitive payment gateway details
    if (ret.paymentGateway) {
      ret.paymentGateway = {
        paymentId: ret.paymentGateway.paymentId,
        // Hide other sensitive data
      };
    }
    return ret;
  }
});

export default mongoose.model('Payment', paymentSchema);