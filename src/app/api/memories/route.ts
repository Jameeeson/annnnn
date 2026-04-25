import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Memory from '@/models/Memory';

// GET all memories
export async function GET() {
  try {
    await dbConnect();
    const memories = await Memory.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: memories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch memories' }, { status: 500 });
  }
}

// POST a new memory (upload image + caption)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { imageUrl, caption, tag } = body;

    if (!imageUrl || !caption) {
      return NextResponse.json({ success: false, error: 'Please provide imageUrl and caption' }, { status: 400 });
    }

    // In a real app, you might want to upload base64 to Cloudinary here.
    // For now, storing base64 directly in MongoDB. (Ensure payload size limits are handled in Next.js config if needed).

    const memory = await Memory.create({ imageUrl, caption, tag });

    return NextResponse.json({ success: true, data: memory }, { status: 201 });
  } catch (error) {
    console.error('Error creating memory:', error);
    return NextResponse.json({ success: false, error: 'Failed to create memory' }, { status: 500 });
  }
}
