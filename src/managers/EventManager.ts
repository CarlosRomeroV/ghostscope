import { GhostDefinition } from "../data/ghosts";

export class EventManager {
  constructor(private ghost: GhostDefinition) {}

  shouldTrigger(eventName: string): boolean {
    const e = this.ghost.events[eventName];
    return e?.enabled ?? false;
  }

  getParams(eventName: string): Record<string, any> {
    return this.ghost.events[eventName]?.params ?? {};
  }
}
