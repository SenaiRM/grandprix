import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuthApi } from '@/lib/auth';
import { sseEmitter } from '@/lib/sse-emitter';
import { TeamPayload } from '@/types';

export async function GET() {
  const teams = await prisma.team.findMany({
    include: { members: { orderBy: { order: 'asc' } }, padrinho: true },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json({ teams });
}

export async function POST(req: Request) {
  const auth = await requireAuthApi();
  if (auth) return auth;

  const body: TeamPayload = await req.json();

  if (!body.name?.trim() || !body.emoji?.trim()) {
    return NextResponse.json({ error: 'Nome e emoji são obrigatórios' }, { status: 400 });
  }

  const leaderCount = body.members.filter((m) => m.isLeader).length;
  if (leaderCount !== 1) {
    return NextResponse.json({ error: 'Exatamente um membro deve ser o líder' }, { status: 400 });
  }

  const team = await prisma.team.create({
    data: {
      name: body.name.trim(),
      emoji: body.emoji.trim(),
      members: {
        create: body.members.map((m, i) => ({
          name: m.name.trim(),
          photoUrl: m.photoUrl || null,
          isLeader: m.isLeader,
          order: i,
        })),
      },
      ...(body.padrinho
        ? {
            padrinho: {
              create: {
                name: body.padrinho.name.trim(),
                photoUrl: body.padrinho.photoUrl || null,
              },
            },
          }
        : {}),
    },
    include: { members: { orderBy: { order: 'asc' } }, padrinho: true },
  });

  sseEmitter.emit({
    type: 'TEAM_CREATED',
    teamId: team.id,
    payload: { ...team, updatedAt: team.updatedAt.toISOString() } as never,
    timestamp: Date.now(),
  });

  return NextResponse.json({ team }, { status: 201 });
}
