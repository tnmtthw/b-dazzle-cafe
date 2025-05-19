import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Ensure request body exists and convert to proper type for Vercel Blob
    const body = request.body;
    if (!body) {
      return NextResponse.json(
        { error: 'Request body is empty' },
        { status: 400 }
      );
    }

    // Upload content to Vercel Blob
    // The type assertion here helps TypeScript understand that body is valid for put()
    const blob = await put(filename, body as ReadableStream<Uint8Array>, {
      access: 'public',
    });

    // Return the blob data
    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error in upload API:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}