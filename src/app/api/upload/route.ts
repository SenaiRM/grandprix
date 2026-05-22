import { NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export async function POST(req: Request) {
  const auth = await requireAuthApi();
  if (auth) return auth;

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Apenas imagens são permitidas' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Arquivo muito grande (máx 2 MB)' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { error: 'Cloudinary não configurado — adicione CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET nas variáveis do Railway' },
      { status: 500 }
    );
  }

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'grandprix',
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    });
    return NextResponse.json({ url: result.secure_url });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro no upload';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
