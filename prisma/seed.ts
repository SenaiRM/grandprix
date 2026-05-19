import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEAMS = [
  { name: 'Equipe Alpha',   emoji: '🔥' },
  { name: 'Equipe Beta',    emoji: '⚡' },
  { name: 'Equipe Gamma',   emoji: '🌊' },
  { name: 'Equipe Delta',   emoji: '🎯' },
  { name: 'Equipe Epsilon', emoji: '💎' },
  { name: 'Equipe Zeta',    emoji: '🌟' },
  { name: 'Equipe Eta',     emoji: '🦁' },
  { name: 'Equipe Theta',   emoji: '🐉' },
  { name: 'Equipe Iota',    emoji: '🦅' },
  { name: 'Equipe Kappa',   emoji: '🌈' },
  { name: 'Equipe Lambda',  emoji: '🎪' },
  { name: 'Equipe Mu',      emoji: '🚀' },
];

async function main() {
  console.log('Semeando banco de dados com 12 equipes...');

  for (const t of TEAMS) {
    const existing = await prisma.team.findFirst({ where: { name: t.name } });
    if (existing) continue;

    await prisma.team.create({
      data: {
        name: t.name,
        emoji: t.emoji,
        currentPhase: 0,
        members: {
          create: Array.from({ length: 5 }, (_, i) => ({
            name: `Membro ${i + 1}`,
            isLeader: i === 0,
            order: i,
          })),
        },
        padrinho: {
          create: { name: 'A definir' },
        },
      },
    });
  }

  console.log('Concluído! 12 equipes criadas na fase "Ponto de Partida".');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
