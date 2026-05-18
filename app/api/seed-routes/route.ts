import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ROUTES_DATA } from '@/lib/data/routes';

export async function GET() {
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
