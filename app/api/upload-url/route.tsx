import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Ensure these environment variables are set correctly
const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  const { bucketName, objectName } = await request.json();

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(objectName);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating signed URL:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}