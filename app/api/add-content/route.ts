import { auth, currentUser } from "@clerk/nextjs";

import { NextRequest, NextResponse } from 'next/server'

const tus = require('tus-js-client')

const api_key = process.env.SUPABASE_API_SECRET;
// const project_url = process.env.SUPABASE_PROJECT_URL;
const project_id = process.env.SUPABASE_PROJECT_ID;


// import { createClient } from '@supabase/supabase-js'

// // Create Supabase client
// const supabase = createClient(project_url, api_key)

// Upload file using standard upload
async function uploadFile(bucketName: string, fileName: string, file: any) {

  return new Promise<void>((resolve, reject) => {
      var upload = new tus.Upload(file, {
          endpoint: `https://${project_id}.supabase.co/storage/v1/upload/resumable`,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          headers: {
              authorization: `Bearer ${api_key}`,
              'x-upsert': 'true', // optionally set upsert to true to overwrite existing files
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
          metadata: {
              bucketName: bucketName,
              objectName: fileName,
              contentType: 'video/mp4',
              cacheControl: 3600,
          },
          chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
          onError: function (error) {
              console.log('Failed because: ' + error)
              reject(error)
          },
          onProgress: function (bytesUploaded: number, bytesTotal: number) {
              var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
              console.log(bytesUploaded, bytesTotal, percentage + '%')
          },
          onSuccess: function () {
              console.log('Download %s from %s', upload.file.name, upload.url)
              resolve()
          },
      })


      // Check if there are any previous uploads to continue.
      return upload.findPreviousUploads().then(function (previousUploads: string | any[]) {
          // Found previous uploads so we select the first one.
          if (previousUploads.length) {
              upload.resumeFromPreviousUpload(previousUploads[0])
          }

          // Start the upload
          upload.start()
      })
  })
}

export async function POST(request: NextRequest) {

  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false })
  }

   const bytes = await file.arrayBuffer()
   const buffer = Buffer.from(bytes)

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  // const path = `/tmp/${file.name}`
  // await writeFile(path, buffer)
  await uploadFile('content-bank',`${userId}/${file.name}`, buffer)
  console.log(`open to see the uploaded file`)

  return NextResponse.json({ success: true })
}
