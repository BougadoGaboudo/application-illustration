import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const commissions = await prisma.commission.findMany();
        return NextResponse.json(commissions, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Error finding commissions data"}, {status: 500});
    }
}