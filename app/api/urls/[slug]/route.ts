import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const data = await prisma.shortURL.findUnique({ where: { slug: params.slug } })
    if (!data) return NextResponse.json({ error: 'URL not found' }, { status: 404 })
  return NextResponse.json(data)
}