import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const illustrations = await prisma.illustration.findMany();
        return NextResponse.json(illustrations, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Error finding illustrations data"}, {status: 500});
    }
}