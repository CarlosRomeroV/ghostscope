// Orden configurable de escenas y gameplay para cada nivel
// Cada paso es 'scene:sceneId' o 'gameplay'

interface LevelOrder {
  [key: string]: string[];
}

const levelOrder: LevelOrder = {
  level1: [
    'gameplay',
  ],
  level2: [
    'scene:level2InitialScene',
    'gameplay',
  ],
};

export default levelOrder; 