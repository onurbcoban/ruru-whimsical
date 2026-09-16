import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pieces = await sql`
      SELECT id, title, price, category, created_at 
      FROM public.pieces 
      ORDER BY order_index ASC;
    `;
    return NextResponse.json({
      status: 'connected',
      database: 'PostgreSQL 16 (Docker Container)',
      timestamp: new Date().toISOString(),
      count: pieces.length,
      data: pieces,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
