import { Schema, model, models, Document, Model, Types } from 'mongoose';
import { Event } from './event.model';

// Core attributes for a Booking document
export interface BookingAttrs {
  eventId: Types.ObjectId;
  email: string;
}

// Booking document shape used across the application
export interface BookingDocument extends Document, BookingAttrs {
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingModel extends Model<BookingDocument> {}

// Simple, production-friendly email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<BookingDocument, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true, // index for efficient lookups by event
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        // Validate that the email is syntactically correct
        validator: (value: string): boolean => EMAIL_REGEX.test(value),
        message: 'Email must be a valid email address.',
      },
    },
  },
  {
    // Automatically manage createdAt and updatedAt fields
    timestamps: true,
  }
);

// Explicit index on eventId to optimize event-based queries
bookingSchema.index({ eventId: 1 });

// Pre-save hook to ensure the referenced event exists and email is valid.
// This prevents orphaned bookings and enforces data integrity at the model layer.
bookingSchema.pre<BookingDocument>('save', async function () {
  if (typeof this.email !== 'string' || this.email.trim().length === 0) {
    throw new Error('Email is required and cannot be empty.');
  }

  if (!EMAIL_REGEX.test(this.email)) {
    throw new Error('Email must be a valid email address.');
  }

  // Verify that the referenced Event exists before creating the booking
  const eventExists = await Event.exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error('Cannot create booking: referenced event does not exist.');
  }
});

export const Booking: BookingModel =
  (models.Booking as BookingModel | undefined) ||
  model<BookingDocument, BookingModel>('Booking', bookingSchema);
