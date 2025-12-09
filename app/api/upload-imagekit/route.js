import { NextResponse } from "next/server";
import ImageKit from "imagekit"

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
});

export async function POST(req){
    const formData = await req.formData();
    const files = formData.getAll("files");
    const uploadedImages = [];

    for(const file of files){
        const buffer = Buffer.from(await file.arrayBuffer());

        const upload = await imagekit.upload({
            file: buffer,
            fileName: file.name,
        });

        uploadedImages.push({
            url: upload.url,
            fileId: upload.fileId
        })
    }
    console.log("Image Uploaded | ImageKit API")
    return NextResponse.json({images: uploadedImages});
}