# Sistema de Diálogos

Este documento explica cómo crear y utilizar nuevas escenas de diálogo en el juego.

## Estructura de una Escena

Una escena de diálogo se define como un objeto que sigue la siguiente estructura:

```typescript
interface DialogScene {
  id: string;                    // Identificador único de la escena
  characters: DialogCharacter[]; // Personajes que aparecerán en la escena
  lines: DialogLine[];          // Líneas de diálogo
  background?: string;          // URL de la imagen de fondo (opcional)
}
```

### Personajes

Los personajes se definen así:

```typescript
interface DialogCharacter {
  name: string;           // Nombre del personaje
  image: string;          // URL de la imagen del personaje
  position: 'left' | 'right'; // Posición en la pantalla
}
```

### Líneas de Diálogo

Las líneas de diálogo se definen así:

```typescript
interface DialogLine {
  character: DialogCharacter;  // Personaje que habla
  text: string;               // Texto del diálogo
  effects?: {                 // Efectos de texto (opcional)
    type: 'wave' | 'shake' | 'glow';
    text: string;
  }[];
}
```

## Efectos de Texto Disponibles

- `wave`: Hace que el texto se mueva en forma de onda
- `shake`: Hace que el texto tiemble
- `glow`: Hace que el texto brille

## Ejemplo de Uso

```typescript
const miEscena: DialogScene = {
  id: 'escena_intro',
  characters: [
    {
      name: 'Snake',
      image: '/images/snake.png',
      position: 'left'
    },
    {
      name: 'Otacon',
      image: '/images/otacon.png',
      position: 'right'
    }
  ],
  lines: [
    {
      character: characters[0],
      text: '¡Otacon! ¿Has visto eso?',
      effects: [
        {
          type: 'wave',
          text: '¡Otacon!'
        }
      ]
    },
    {
      character: characters[1],
      text: 'Sí, Snake. Es <shake>aterrador</shake>.'
    }
  ],
  background: '/images/lab_background.png'
};
```

## Cómo Implementar una Nueva Escena

1. Crea un nuevo archivo en `src/scenes/` para tu escena
2. Define la escena siguiendo la estructura anterior
3. Importa y usa el componente `DialogSystem`:

```typescript
import DialogSystem from '../components/DialogSystem';

// En tu componente:
const [showDialog, setShowDialog] = useState(false);

// ...

<DialogSystem
  scene={miEscena}
  isVisible={showDialog}
  onComplete={() => setShowDialog(false)}
/>
```

## Consejos

1. Mantén las imágenes de los personajes con un tamaño consistente (recomendado: 400x500px)
2. Usa los efectos de texto con moderación para no sobrecargar la escena
3. Asegúrate de que las imágenes de fondo tengan una buena resolución pero no sean demasiado pesadas
4. Los nombres de los personajes aparecerán en el formato `[Nombre]:` en el diálogo 