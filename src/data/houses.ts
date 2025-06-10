import h1_upstairs from '../images/h1_upstairs.jpg';
import h1_downstairs from '../images/h1_downstairs.jpg';
import h1_pasillo from '../images/h1_pasillo.jpg';

export type House = {
    id: string;
    name: string;
    description: string;
    cameras: string[]; // URLs de imágenes o IDs de habitaciones
  };
  
  export const HOUSES: House[] = [
    {
      id: "level1-special",
      name: "Casa Abandonada (Tutorial)",
      description: "Primer nivel especial con solo 3 cámaras.",
      cameras: [
        h1_upstairs,
        h1_downstairs,
        h1_pasillo,
      ]
    },
    {
      id: "house1",
      name: "Casa Abandonada Nº1",
      description: "Una casa antigua donde se reportan gritos y sombras.",
      cameras: [
        "https://th.bing.com/th/id/R.80c08851eada02a3cebff18680144a3e?rik=FwIIlUpAnYZHJw&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2fe%2f4%2f9%2f480146.jpg&ehk=y5MdnEeeOZdTg94jcQ1aiQyH4LPvB9idC3pBAu5vQQA%3d&risl=&pid=ImgRaw&r=0",
        "/assets/camera2.jpg",
        "/assets/camera3.jpg",
        "/assets/camera4.jpg",
        "/assets/camera5.jpg",
        "/assets/camera6.jpg",
        "/assets/camera7.jpg",
        "/assets/camera8.jpg",
        "/assets/camera9.jpg",
        "/assets/camera10.jpg"
      ]
    },
  ];
  

  //https://th.bing.com/th/id/R.80c08851eada02a3cebff18680144a3e?rik=FwIIlUpAnYZHJw&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2fe%2f4%2f9%2f480146.jpg&ehk=y5MdnEeeOZdTg94jcQ1aiQyH4LPvB9idC3pBAu5vQQA%3d&risl=&pid=ImgRaw&r=0