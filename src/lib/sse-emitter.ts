import { SSEEvent } from '@/types';

type Listener = (event: SSEEvent) => void;

class SSEEmitter {
  private listeners = new Set<Listener>();

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit(event: SSEEvent): void {
    this.listeners.forEach((fn) => fn(event));
  }
}

const globalForEmitter = global as typeof global & { __sseEmitter?: SSEEmitter };
export const sseEmitter = (globalForEmitter.__sseEmitter ??= new SSEEmitter());
