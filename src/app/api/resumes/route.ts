import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src/data/resumes');

export async function GET() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
    const resumes = files.map(file => {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
      const data = JSON.parse(content);
      return {
        id: data.id || file.replace('.json', ''),
        title: data.title || 'Untitled',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        // We only return metadata for the list to keep it light
      };
    }).sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());

    return NextResponse.json(resumes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to list resumes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = Date.now().toString();
    const newResume = {
      ...body,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(path.join(dataDir, `${id}.json`), JSON.stringify(newResume, null, 2));
    return NextResponse.json(newResume);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
  }
}
