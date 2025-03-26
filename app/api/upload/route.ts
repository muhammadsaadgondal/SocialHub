import { NextResponse } from "next/server";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import { IncomingMessage } from "http";

// Disable default body parsing so that formidable can parse the form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Define the upload directory (inside public so files are served statically)
const uploadDir = path.join(process.cwd(), "public", "uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: Request) {
  return new Promise<NextResponse>((resolve, reject) => {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    });

    // Convert Next.js Request to IncomingMessage for formidable
    const incomingMessage = new IncomingMessage(new (require("net").Socket)());
    incomingMessage.headers = Object.fromEntries(req.headers.entries());
    incomingMessage.method = req.method || "POST";
    req.body?.pipeTo(new WritableStream({
      write(chunk) {
        incomingMessage.push(chunk);
      },
      close() {
        incomingMessage.push(null);
      }
    }));

    form.parse(incomingMessage, (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return reject(
          NextResponse.json({ error: "Error parsing form data" }, { status: 500 })
        );
      }

      // Assume the file input field is named "file"
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) {
        return resolve(
          NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        );
      }

      // Build the public URL for the uploaded file (served from /public/uploads)
      const publicUrl = `/uploads/${path.basename(file.filepath)}`;
      resolve(NextResponse.json({ url: publicUrl }));
    });
  });
}