import { Schema, model, models, Document, Model } from 'mongoose';

// Core attributes for an Event document
export interface EventAttrs {
  title: string;
  slug?: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // 24h time string (HH:MM)
  mode: string; // e.g. "online", "offline", "hybrid"
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

// Event document type used throughout the app
export interface EventDocument extends Document, EventAttrs {
  createdAt: Date;
  updatedAt: Date;
}

export type EventModel = Model<EventDocument>

// Helper to generate a URL-friendly slug from the title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, ''); // trim leading and trailing dashes
}

// Normalize time to 24-hour HH:MM format and validate value
function normalizeTime(input: string): string {
  const trimmed = input.trim();
  const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(trimmed);

  if (!match) {
    throw new Error('Time must be in HH:MM or HH:MM:SS format.');
  }

  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Time must represent a valid 24-hour clock value.');
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

const eventSchema = new Schema<EventDocument, EventModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true }, // unique index for fast lookups
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean => Array.isArray(value) && value.length > 0,
        message: 'Agenda must contain at least one item.',
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean => Array.isArray(value) && value.length > 0,
        message: 'Tags must contain at least one tag.',
      },
    },
  },
  {
    // Automatically manage createdAt and updatedAt fields
    timestamps: true,
  }
);

// Ensure slug remains unique at the database level
eventSchema.index({ slug: 1 }, { unique: true });

// Pre-save hook to generate slug, normalize date/time, and enforce non-empty values
// This runs before every save, keeping persisted data consistent.
eventSchema.pre<EventDocument>('save', function () {
  // Validate that required string fields are non-empty after trimming
  const requiredStringFields: (keyof EventAttrs)[] = [
    'title',
    'description',
    'overview',
    'image',
    'venue',
    'location',
    'date',
    'time',
    'mode',
    'audience',
    'organizer',
  ];

  for (const field of requiredStringFields) {
    const value = this[field];
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`Field "${field}" is required and cannot be empty.`);
    }
  }

  if (!Array.isArray(this.agenda) || this.agenda.length === 0) {
    throw new Error('Agenda must contain at least one item.');
  }

  if (!Array.isArray(this.tags) || this.tags.length === 0) {
    throw new Error('Tags must contain at least one tag.');
  }

  // Normalize date to ISO-8601 (YYYY-MM-DD) for consistent storage and querying
  const parsedDate = new Date(this.date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date value; unable to parse date.');
  }
  this.date = parsedDate.toISOString().split('T')[0];

  // Normalize time to a strict 24-hour HH:MM format
  this.time = normalizeTime(this.time);

  // Generate or regenerate slug only when title changes to keep URLs stable
  if (this.isModified('title') || !this.slug) {
    this.slug = generateSlug(this.title);
  }
});

export const Event: EventModel =
  (models.Event as EventModel | undefined) || model<EventDocument, EventModel>('Event', eventSchema);
