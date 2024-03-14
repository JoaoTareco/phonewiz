import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query'],
});

const project_id = process.env.SUPABASE_PROJECT_ID;

export async function GET(
  req: Request
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const result = await prisma.$queryRawUnsafe(`SELECT name FROM storage.objects where name like '${userId}/%'`)

    // Assert the type of result
    const typedResult = result as { name: string }[];

    let assets: any[] = []

    // Use typedResult instead of result
    typedResult.forEach((asset) => {
      assets.push({video: `https://${project_id}.supabase.co/storage/v1/object/public/content-bank/${asset.name}`})
    });

    
    return NextResponse.json(assets);
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
