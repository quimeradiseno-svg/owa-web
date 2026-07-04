export interface DistanceInfo {
  id: string;
  type: string; // e.g., "PUNTO A PUNTO"
  distance: string; // e.g., "4K"
  description: string[]; // array of strings for multiple paragraphs
  hasMap: boolean;
}

export interface RaceDetailData {
  id: string;
  title: string;
  subtitleDistances: string;
  badge: string; // e.g., "Super Sprint" or "Challenge"
  image: string;
  code: string;
  date: string;
  location: string;
  distances: DistanceInfo[];
  scheduleLink?: string;
  tourismInfo?: string;
  hashtag: string;
  rulesLink?: string;
}

export const racesData: Record<string, RaceDetailData> = {
  spd: {
    id: "spd",
    title: "SAN PEDRO",
    subtitleDistances: "7 km | 4 km",
    badge: "Super Sprint",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1200&auto=format&fit=crop",
    code: "SPD",
    date: "21 de DICIEMBRE",
    location: "San Pedro - Buenos Aires",
    distances: [
      {
        id: "4k",
        type: "PUNTO A PUNTO",
        distance: "4K",
        description: [
          "🏁 La largada se realizará a orillas del río, a 4 km río arriba de la llegada. Desde allí, se nada con corriente a favor hasta alcanzar la boya que señaliza la proximidad del embudo de llegada, para luego ingresar y finalizar la prueba con el toque en la placa 🏅.",
          "⚡ Una carrera rápida y estratégica, donde la concentración y una buena navegación serán claves para marcar la diferencia frente a tus rivales 🧭💨.",
          "🔥 Suma puntos importantes para el circuito y también para tu equipo en el campeonato anual. ¡No te la pierdas! 🏆👊"
        ],
        hasMap: true
      },
      {
        id: "7k",
        type: "PUNTO A PUNTO",
        distance: "7K",
        description: [
          "🏁 La largada se realizará a orillas del río, 7 km río arriba de la llegada. El recorrido será con corriente a favor, hasta alcanzar la boya que señaliza la proximidad del embudo de llegada. Desde allí, ingresarás al tramo final y completarás la prueba con el toque en la placa 🏅.",
          "🔥 Una carrera que promete ser muy disputada, como cada año. Pero atención: si dejaste atrás el Buque Museo ARA Irigoyen... ¡te pasaste! 🚫⛴️",
          "💥 En los últimos 200 metros, el público y tus compañeros de equipo podrán seguirte desde la costa para darte aliento en el cierre 🗣️👏.",
          "📈 Los puntos que consigas en esta primera fecha pueden ser decisivos al final del circuito y fundamentales para tu equipo en el campeonato anual 🏆💪."
        ],
        hasMap: true
      },
      {
        id: "1.5k",
        type: "SUPER SPRINT",
        distance: "1.5K",
        description: [
          "🔥 Mientras esperamos la premiación de los 4 y 7K... se viene algo nuevo.\\nLlega la primera edición del Super Sprint, un formato explosivo que pone a prueba velocidad, estrategia y orgullo de equipo 🏁⚡",
          "🚨 Con cupo limitado por género y largadas separadas, esta carrera será solo por invitación. Si tu equipo trajo varios nadadores, tendrá derecho a postular a su representante más rápido para competir a todo o nada. No hay categorías. No hay excusas. Solo un ganador y una ganadora se alzarán con el trofeo y los premios de nuestros sponsors 🏆🎁",
          "💥 ¿Rápida? No, rapidísima. Un sprint de 1.500 metros río abajo que puede definirse por foto finish 📸.\\nUna oportunidad única para sumar puntos clave y empujar a tu equipo hacia la cima del campeonato 🧮🔝",
          "🃏 Si creés que podés ser el o la número 1, postulate para recibir un wild card y asegurá tu lugar en este nuevo formato que llega para quedarse 💪"
        ],
        hasMap: true
      }
    ],
    tourismInfo: "La Ciudad de San Pedro está situada al Noroeste de la Provincia de Buenos Aires sobre el kilómetro 164 de la RN 9, a unos 164km de Buenos Aires y a 150km de Rosario.",
    hashtag: "#CircuitoOwa",
    scheduleLink: "#",
    rulesLink: "#"
  },
  lbc: {
    id: "lbc",
    title: "LAGO NAHUEL HUAPI",
    subtitleDistances: "Próximamente",
    badge: "Circuito",
    image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1200&auto=format&fit=crop",
    code: "LBC",
    date: "13 de DICIEMBRE",
    location: "Bariloche - Río Negro",
    distances: [
      {
        id: "tbd",
        type: "DISTANCIAS",
        distance: "TBD",
        description: [
          "Información detallada sobre las distancias, recorridos y reglamentos de esta etapa se publicarán próximamente."
        ],
        hasMap: false
      }
    ],
    hashtag: "#CircuitoOwa",
  },
  vob: {
    id: "vob",
    title: "VUELTA DE OBLIGADO",
    subtitleDistances: "Próximamente",
    badge: "Circuito",
    image: "https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=1200&auto=format&fit=crop",
    code: "VOB",
    date: "20 de DICIEMBRE",
    location: "San Pedro - Buenos Aires",
    distances: [
      {
        id: "tbd",
        type: "DISTANCIAS",
        distance: "TBD",
        description: [
          "Información detallada sobre las distancias, recorridos y reglamentos de esta etapa se publicarán próximamente."
        ],
        hasMap: false
      }
    ],
    hashtag: "#CircuitoOwa",
  },
  pnr: {
    id: "pnr",
    title: "RÍO PARANÁ",
    subtitleDistances: "Próximamente",
    badge: "Circuito",
    image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1200&auto=format&fit=crop",
    code: "PNR",
    date: "17 de ENERO",
    location: "Paraná - Entre Ríos",
    distances: [
      {
        id: "tbd",
        type: "DISTANCIAS",
        distance: "TBD",
        description: [
          "Información detallada sobre las distancias, recorridos y reglamentos de esta etapa se publicarán próximamente."
        ],
        hasMap: false
      }
    ],
    hashtag: "#CircuitoOwa",
  },
  "gp-1": {
    id: "gp-1",
    title: "FECHA 1 GRAND PRIX",
    subtitleDistances: "Próximamente",
    badge: "Grand Prix",
    image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1200&auto=format&fit=crop",
    code: "GP1",
    date: "TBD",
    location: "Por confirmar",
    distances: [
      {
        id: "tbd",
        type: "DISTANCIAS",
        distance: "TBD",
        description: ["Información detallada se publicará próximamente."],
        hasMap: false
      }
    ],
    hashtag: "#OwaGrandPrix",
  },
  "gp-2": {
    id: "gp-2",
    title: "FECHA 2 GRAND PRIX",
    subtitleDistances: "Próximamente",
    badge: "Grand Prix",
    image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1200&auto=format&fit=crop",
    code: "GP2",
    date: "TBD",
    location: "Por confirmar",
    distances: [
      {
        id: "tbd",
        type: "DISTANCIAS",
        distance: "TBD",
        description: ["Información detallada se publicará próximamente."],
        hasMap: false
      }
    ],
    hashtag: "#OwaGrandPrix",
  },
  "gp-3": {
    id: "gp-3",
    title: "FECHA 3 GRAND PRIX",
    subtitleDistances: "Próximamente",
    badge: "Grand Prix",
    image: "https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=1200&auto=format&fit=crop",
    code: "GP3",
    date: "TBD",
    location: "Por confirmar",
    distances: [
      {
        id: "tbd",
        type: "DISTANCIAS",
        distance: "TBD",
        description: ["Información detallada se publicará próximamente."],
        hasMap: false
      }
    ],
    hashtag: "#OwaGrandPrix",
  },
  "gp-4": {
    id: "gp-4",
    title: "FECHA 4 GRAND PRIX",
    subtitleDistances: "Próximamente",
    badge: "Grand Prix",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1200&auto=format&fit=crop",
    code: "GP4",
    date: "TBD",
    location: "Por confirmar",
    distances: [
      {
        id: "tbd",
        type: "DISTANCIAS",
        distance: "TBD",
        description: ["Información detallada se publicará próximamente."],
        hasMap: false
      }
    ],
    hashtag: "#OwaGrandPrix",
  },
  "ch-1": {
    id: "ch-1",
    title: "DESAFÍO 1 CHALLENGE",
    subtitleDistances: "Próximamente",
    badge: "Challenge",
    image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1200&auto=format&fit=crop",
    code: "CH1",
    date: "TBD",
    location: "Por confirmar",
    distances: [
      {
        id: "tbd",
        type: "DISTANCIAS",
        distance: "TBD",
        description: ["Información detallada sobre esta travesía extrema se publicará próximamente."],
        hasMap: false
      }
    ],
    hashtag: "#OwaChallenge",
  },
  "ch-2": {
    id: "ch-2",
    title: "DESAFÍO 2 CHALLENGE",
    subtitleDistances: "Próximamente",
    badge: "Challenge",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1200&auto=format&fit=crop",
    code: "CH2",
    date: "TBD",
    location: "Por confirmar",
    distances: [
      {
        id: "tbd",
        type: "DISTANCIAS",
        distance: "TBD",
        description: ["Información detallada sobre esta travesía extrema se publicará próximamente."],
        hasMap: false
      }
    ],
    hashtag: "#OwaChallenge",
  }
};
