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
  