import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuthApi } from '@/lib/auth';
import { sseEmitter } from '@/lib/sse-emitter';
import { TeamPayload } from '@/types';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await prisma.team.findUnique({
    where: { id },
    include: { members: { orderBy: { order: 'asc' } }, padrinho: true },
  });
  if (!team) return NextResponse.json({ error: 'Equipe não encontrada' }, { status: 404 });
  return NextResponse.json({ team });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuthApi();
  if (auth) return auth;

  const { id } = await params;
  const body: TeamPayload = await req.json();

  if (!body.name?.trim() || !body.emoji?.trim()) {
    return NextResponse.json({ error: 'Nome e emoji são obrigatórios' }, { status: 400 });
  }
  const leaderCount = body.members.filter((m) => m.isLeader).length;
  if (leaderCount !== 1) {
    return NextResponse.json({ error: 'Exatamente um membro deve ser o líder' }, { status: 400 });
  }

  await prisma.member.deleteMany({ where: { teamId: id } });
  await prisma.padrinho.deleteMany({ where: { teamId: id } });

  const team = await prisma.team.update({
    where: { id },
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
    type: 'TEAM_UPDATED',
    teamId: team.id,
    payload: { ...team, updatedAt: team.updatedAt.toISOString() } as never,
    timestamp: Date.now(),
  });

  return NextResponse.json({ team });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuthApi();
  if (auth) return auth;

  const { id } = await params;
  await prisma.team.delete({ where: { id } });

  sseEmitter.emit({
    type: 'TEAM_DELETED',
    teamId: id,
    payload: { id },
    timestamp: Date.now(),
  });

  return NextResponse.json({ success: true });
}
