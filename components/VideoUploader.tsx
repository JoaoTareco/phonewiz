"use client";

import React, { useState, useCallback } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { toast } from 'sonner';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

const VideoUploader = ({ userId, onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [ffmpeg] = useState(() => new FFmpeg());
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    setLoaded(true);
  }, [ffmpeg]);

  const compressVideo = useCallback(async (file) => {
    if (!loaded) await load();

    await ffmpeg.writeFile(file.name, await fetchFile(file));

    await ffmpeg.exec([
      '-i', file.name,
      '-c:v', 'libx264',
      '-crf', '23',
      '-preset', 'medium',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      '-vf', "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease",
      'output.mp4'
    ]);

    const data = await ffmpeg.readFile('output.mp4');
    return new File([data.buffer], 'compressed_' + file.name, { type: 'video/mp4' });
  }, [ffmpeg, loaded, load]);

  return (
    <FilePond
      files={files}
      onupdatefiles={setFiles}
      allowMultiple={false}
      maxFiles={1}
      acceptedFileTypes={['video/*']}
      maxFileSize="1GB"
      server={{
        process: async (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          try {
            const compressedFile = await compressVideo(file);
            const formData = new FormData();
            formData.append('file', compressedFile);

            const response = await fetch('/api/upload-video', {
              method: 'POST',
              headers: {
                'X-User-Id': userId || '',
              },
              body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const result = await response.json();
            load(result.url);
            toast.success('Video uploaded and compressed successfully');
            onUploadSuccess();
          } catch (err) {
            error('Upload failed');
            toast.error('Failed to upload video');
            console.error('Upload error:', err);
          }
        },
      }}
      labelIdle='Drag & Drop your video or <span class="filepond--label-action">Browse</span>'
    />
  );
};

export default VideoUploader;