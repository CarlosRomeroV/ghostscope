import { GHOSTS, GhostDefinition } from "../data/ghosts";

export class GhostManager {
  private ghost: GhostDefinition;

  constructor() {
    const index = Math.floor(Math.random() * GHOSTS.length);
    this.ghost = GHOSTS[index];
  }

  getActiveGhost(): GhostDefinition {
    return this.ghost;
  }
}
