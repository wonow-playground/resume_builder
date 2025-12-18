import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src/data/resumes');

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Context) {
  try {
    const { id } = await params;
    const filePath = path.join(dataDir, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      // Fallback for default if needed or just 404
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to retrieve resume' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Context) {
  try {
    const { id } = await params;
    const body = await req.json();
    const filePath = path.join(dataDir, `${id}.json`);

    // Ensure we update updatedAt
    const updatedData = {
      ...body,
      id, // ensure ID is consistent
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    return NextResponse.json(updatedData);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Context) {
  try {
    const { id } = await params;
    const filePath = path.join(dataDir, `${id}.json`);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}
