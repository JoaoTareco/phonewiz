import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  const userId = req.headers.get('X-User-Id');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    console.log('FormData keys:', Array.from(formData.keys()));
    console.log('FormData entries:', Array.from(formData.entries()));

    const file = formData.get('file');
    console.log('File:', file);
    console.log('File type:', typeof file);
    console.log('Is Blob:', file instanceof Blob);

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (typeof file !== 'object' || !('size' in file) || !('type' in file)) {
      return NextResponse.json({ error: 'Invalid file object' }, { status: 400 });
    }

    console.log('File size:', file.size);
    console.log('File type:', file.type);

    // Generate a unique filename
    const fileExt = file.type.split('/').pop() || 'bin';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await (file as Blob).arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('content-bank')
      .upload(filePath, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('content-bank')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
