import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/database';
import type { IEvent } from '@/database/event.model';
import {type} from "node:os";

// Shape of route context params for this dynamic route
type RouteParams =  {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/events/[slug]
 * Returns a single event by its slug with clear error handling.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  // Validate slug parameter early to avoid unnecessary DB calls
  if (typeof slug !== 'string' || slug.trim().length === 0) {
    return NextResponse.json(
      { message: 'A valid event slug must be provided in the URL.' },
      { status: 400 },
    );
  }

  const normalizedSlug = slug.trim().toLowerCase();

  try {
    await connectDB();

    // Find a single event by slug; toObject() strips Mongoose internals
    const eventDoc = await Event.findOne({ slug: normalizedSlug }).exec();

    if (!eventDoc) {
      return NextResponse.json(
        { message: `Event with slug "${normalizedSlug}" was not found.` },
        { status: 404 },
      );
    }

    const event: IEvent = eventDoc.toObject();

    return NextResponse.json(
      {
        message: 'Event fetched successfully.',
        event,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    // Differentiate between expected validation-like errors and unexpected failures
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred while fetching the event.';

    console.error('GET /api/events/[slug] error:', error);

    return NextResponse.json(
      {
        message: 'Failed to fetch event.',
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
