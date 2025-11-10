import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export const config = {
  api: {
    bodyParser: false,
  },
}

// Disable default body parser
export const runtime = 'nodejs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50MB (for videos)
      keepExtensions: true,
    })

    const [fields, files] = await form.parse(req)

    const file = Array.isArray(files.file) ? files.file[0] : files.file
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const fileStream = fs.createReadStream(file.filepath)

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'my-x',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      fileStream.pipe(uploadStream)
    })

    // Clean up temp file
    try {
      fs.unlinkSync(file.filepath)
    } catch (unlinkError) {
      // Ignore unlink errors
    }

    return res.status(200).json({
      url: (result as any).secure_url,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ error: 'Upload failed' })
  }
}

