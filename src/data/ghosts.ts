export type GhostEventBehavior = {
    name: string;
    enabled: boolean;
    params?: Record<string, any>;
  };
  
  export type GhostDefinition = {
    id: string;
    name: string;
    events: Record<string, GhostEventBehavior>;
  };
  
  export const GHOSTS: GhostDefinition[] = [
    {
      id: "phantom",
      name: "Phantom",
      events: {
        orb: { name: "Orbes", enabled: true, params: { speed: 1, wobble: 0.6 } },
        glitch: { name: "Glitch Rojo", enabled: true, params: { intensity: "medium" } },
      },
    },
    {
      id: "poltergeist",
      name: "Poltergeist",
      events: {
        orb: { name: "Orbes", enabled: false },
        glitch: { name: "Glitch Rojo", enabled: true, params: { intensity: "high" } },
      },
    },
  ];