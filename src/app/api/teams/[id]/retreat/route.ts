import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuthApi } from '@/lib/auth';
import { sseEmitter } from '@/lib/sse-emitter';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuthApi();
  if (auth) return auth;

  const { id } = await params;
  const current = await prisma.team.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: 'Equipe não encontrada' }, { status: 404 });
  if (current.currentPhase <= 0) {
    return NextResponse.json({ error: 'Equipe já está na primeira fase' }, { status: 400 });
  }

  const team = await prisma.team.update({
    where: { id },
    data: { currentPhase: current.currentPhase - 1 },
    include: { members: { orderBy: { order: 'asc' } }, padrinho: true },
  });

  sseEmitter.emit({
    type: 'TEAM_RETREATED',
    teamId: team.id,
    payload: { ...team, updatedAt: team.updatedAt.toISOString() } as never,
    timestamp: Date.now(),
  });

  return NextResponse.json({ team });
}
