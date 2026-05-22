export type PhaseIndex = 0 | 1 | 2 | 3 | 4 | 5;

export interface Phase {
  index: PhaseIndex;
  key: string;
  label: string;
  subtitle: string;
  description: string;
  emoji: string;
  color: string;
}

export interface TeamMember {
  id: string;
  name: string;
  photoUrl: string | null;
  isLeader: boolean;
  order: number;
}

export interface Padrinho {
  id: string;
  name: string;
  photoUrl: string | null;
}

export interface Team {
  id: string;
  name: string;
  emoji: string;
  currentPhase: PhaseIndex;
  members: TeamMember[];
  padrinho: Padrinho | null;
  updatedAt: string;
}

export interface TeamsResponse {
  teams: Team[];
}

export interface TeamPayload {
  name: string;
  emoji: string;
  members: Omit<TeamMember, 'id'>[];
  padrinho: Omit<Padrinho, 'id'> | null;
}

export type SSEEventType =
  | 'TEAM_ADVANCED'
  | 'TEAM_RETREATED'
  | 'TEAM_UPDATED'
  | 'TEAM_CREATED'
  | 'TEAM_DELETED';

export interface SSEEvent {
  type: SSEEventType;
  teamId: string;
  payload: Team | { id: string };
  timestamp: number;
}
