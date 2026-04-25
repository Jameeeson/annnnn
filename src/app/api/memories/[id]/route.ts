import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Memory from '@/models/Memory';

// PUT to update a memory's caption
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await dbConnect();
    
    const body = await request.json();
    const { caption } = body;

    const memory = await Memory.findByIdAndUpdate(
      id,
      { caption },
      { new: true, runValidators: true }
    );

    if (!memory) {
      return NextResponse.json({ success: false, error: 'Memory not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: memory }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update memory' }, { status: 500 });
  }
}

// DELETE a memory
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await dbConnect();

    const deletedMemory = await Memory.deleteOne({ _id: id });

    if (!deletedMemory) {
      return NextResponse.json({ success: false, error: 'Memory not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete memory' }, { status: 500 });
  }
}
