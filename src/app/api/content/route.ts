import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const content = await prisma.pageContent.findFirst();
    if (!content) {
      // Return defaults if nothing exists yet
      return NextResponse.json({
        heroEst: "Est. 2024",
        heroTagline: "The Art of Living",
        philosophyQuote: "\"Design is not just what it looks like and feels like. <span class='text-rua-red italic'>Design is how it works.</span>\"",
        philosophyText: "RUA encapsulates the essence of timeless aesthetics. We blend raw materials with refined craftsmanship to create spaces that breathe. Our collection is an ode to the imperfect beauty of nature and the precision of modern architecture."
      });
    }
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const existing = await prisma.pageContent.findFirst();
    
    if (existing) {
      const updated = await prisma.pageContent.update({
        where: { id: existing.id },
        data: {
          heroEst: data.heroEst,
          heroTagline: data.heroTagline,
          philosophyQuote: data.philosophyQuote,
          philosophyText: data.philosophyText,
        }
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.pageContent.create({
        data: {
          heroEst: data.heroEst,
          heroTagline: data.heroTagline,
          philosophyQuote: data.philosophyQuote,
          philosophyText: data.philosophyText,
        }
      });
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
