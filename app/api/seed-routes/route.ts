import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ROUTES_DATA } from '@/lib/data/routes';

export async function GET(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const provided = request.headers.get('x-setup-secret') ?? request.nextUrl.searchParams.get('secret');
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Optional: Delete existing routes to avoid duplicates if re-running
    // await db.route.deleteMany();

    const createdRoutes = await Promise.all(
      ROUTES_DATA.map(async (route) => {
        return db.route.upsert({
          where: { slug: route.slug },
          update: route,
          create: route,
        });
      })
    );

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdRoutes.length} routes.`,
      routes: createdRoutes,
    });
  } catch (error) {
    console.error('Error seeding routes:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed routes.', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
