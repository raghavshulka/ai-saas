import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "@/lib/auth";
// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.ClApi,
  api_secret: process.env.ClSecret,
});
// console.log(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, process.env.ClApi, process.env.ClSecret)

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "user not found" }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }
    // console.log("file",file)

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "next-cloudinary-uploads" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );
        uploadStream.end(buffer);
      }
    );
    console.log("resuls", result.secure_url);

    return NextResponse.json(
      {
        publicId: result.public_id,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("UPload image failed", error);
    return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
  }
}
