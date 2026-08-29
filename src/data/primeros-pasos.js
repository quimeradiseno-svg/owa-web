// Contenido de "Primeros pasos", la guía para quien nada en pileta y todavía
// no se animó a una carrera de aguas abiertas. Texto pasado por OWA
// ("OWA_Primeros_Pasos_Aguas_Abiertas_Sin_Super_Sprint.docx"), portado tal
// cual a bloques de datos para que la vista sólo maquete.

export const HERO = {
  kicker: 'Primeros pasos',
  // Sin <br>: el balance del titular lo resuelve `text-wrap: balance` de la
  // base, y un corte fijo dejaba "EN" colgando en pantallas angostas.
  titulo: 'Tu primera experiencia en aguas abiertas empieza acá',
  subtitulo:
    'Si entrenás en pileta y alguna vez pensaste en nadar en un río, un lago o el mar, pero todavía no te animaste, en <span class="u-sigla">OWA</span> queremos ayudarte a dar ese primer paso.',
};

export const INTRO = {
  titulo: 'No necesitás ser un nadador experto para empezar',
  // Los tres tramos del párrafo original, separados para poder darles peso
  // distinto: arranque, las dudas y el remate.
  lead: 'Es normal tener dudas antes de empezar.',
  dudas:
    'No ver el fondo. La corriente. Las olas. Nadar rodeado de otras personas. No saber cómo orientarte. Preguntarte si vas a poder completar la distancia.',
  remate: 'Todo eso forma parte de descubrir algo nuevo.',
  // Partido en dos: la primera frase va en display y la segunda como bajada.
  destacado: {
    fuerte: 'No importa si nunca participaste de una carrera.',
    suave: 'Lo importante es elegir un desafío acorde a tu preparación.',
  },
  cierre:
    'En <span class="u-sigla">OWA</span> vas a encontrar diferentes distancias, escenarios y niveles de dificultad. Te ayudamos a entender cómo funciona una carrera de aguas abiertas y a encontrar una experiencia adecuada para empezar.',
};

export const CHECKLIST = {
  titulo: '¿Estoy listo para nadar en aguas abiertas?',
  lead: 'Antes de elegir tu primera carrera, hay algunas preguntas que conviene hacerse:',
  preguntas: [
    '¿Nadás regularmente?',
    '¿Qué distancia podés nadar de manera continua en pileta?',
    '¿Tuviste alguna experiencia nadando en río, lago o mar?',
    '¿Te sentís cómodo nadando sin ver el fondo?',
    '¿Alguna vez practicaste orientación en aguas abiertas?',
    '¿Buscás simplemente completar tu primera experiencia o ya querés competir?',
  ],
  cierre: [
    'No necesitás haber participado antes de una carrera.',
    'Pero sí es importante tener una preparación acorde a la distancia y a las características del lugar donde vas a nadar.',
  ],
  destacado: 'Tu primera experiencia no tiene que ser la más difícil. Tiene que ser la adecuada para vos.',
};

export const DUDAS = {
  titulo: 'Es normal tener dudas antes de la primera vez',
  // Bajada nuestra: el documento entra directo a las preguntas y la sección
  // necesitaba una línea que las presente.
  lead: 'Acá respondemos las preocupaciones más comunes de quienes van a nadar en aguas abiertas por primera vez.',
  items: [
    {
      icono: 'ola',
      q: 'Nunca nadé sin ver el fondo.',
      a: 'Es una de las diferencias más grandes con respecto a la pileta y una sensación que conviene experimentar progresivamente antes de tu primera carrera.',
    },
    {
      icono: 'ruta',
      q: 'Me preocupa no poder completar la distancia.',
      a: 'Por eso es tan importante elegir correctamente. No todas las pruebas <span class="u-sigla">OWA</span> tienen la misma distancia, dificultad o condiciones. Conocer el recorrido y llegar con el entrenamiento adecuado forma parte de la experiencia.',
    },
    {
      icono: 'brujula',
      q: 'Me da miedo desorientarme.',
      a: 'En aguas abiertas vas a aprender a levantar la vista y utilizar referencias para mantener el rumbo. Los recorridos de las carreras están señalizados y antes de cada prueba realizamos una charla técnica donde explicamos sus características.',
    },
    {
      icono: 'equipo',
      q: 'Nunca nadé rodeado de tanta gente.',
      a: 'No necesitás disputar posiciones ni largar adelante. Tu primera carrera puede tener un objetivo muy sencillo: completar el recorrido y disfrutar la experiencia.',
    },
    {
      icono: 'chaleco',
      q: '¿Qué pasa si necesito asistencia?',
      a: 'Los eventos <span class="u-sigla">OWA</span> cuentan con un dispositivo de seguridad en el agua compuesto, según las características de cada prueba, por guardavidas, embarcaciones, kayaks, tablas y personal preparado para acompañar y asistir a los nadadores.',
    },
  ],
  // La frase del documento, partida en el punto y coma para poder destacar
  // la primera mitad.
  cierre: {
    fuerte: 'La seguridad también empieza por vos:',
    resto:
      'respetar tu preparación, conocer el recorrido, escuchar las indicaciones y elegir correctamente la distancia son parte fundamental de nadar en aguas abiertas.',
  },
};

export const PERFILES = {
  titulo: '¿Cuál puede ser tu primer desafío?',
  items: [
    {
      icono: 'gota',
      t: 'Estoy dando mis primeros pasos',
      d: 'Entreno en pileta pero tengo poca o ninguna experiencia en aguas abiertas.',
      destino: 'Circuito OWA · Distancias de iniciación',
      detalle:
        'En los eventos del Circuito OWA vas a encontrar diferentes distancias. Las más accesibles de cada fecha pueden ser una buena alternativa para vivir una primera experiencia. La distancia recomendada dependerá de tu preparación, experiencia y de las características particulares de cada recorrido.',
      href: '#recomendadas',
      cta: 'Ver próximas carreras recomendadas',
    },
    {
      icono: 'ondas',
      t: 'Ya nado con regularidad',
      d: 'Tengo una buena base de natación y quiero participar de mi primera carrera de aguas abiertas.',
      destino: 'Circuito OWA',
      detalle:
        'Podés elegir entre diferentes distancias y comenzar a descubrir la competencia en aguas abiertas. No hace falta que tu objetivo sea ganar. Para muchos nadadores, la primera meta es simplemente llegar, completar el recorrido y disfrutarlo.',
      href: '/circuito',
      cta: 'Ver Circuito OWA',
    },
    {
      icono: 'grafico',
      t: 'Ya tengo experiencia en aguas abiertas',
      d: 'Ya participé anteriormente y quiero aumentar la distancia o la exigencia.',
      destino: 'Circuito OWA · Distancias mayores',
      detalle: 'Una posibilidad para seguir creciendo, probar recorridos diferentes y comenzar a plantearte nuevos desafíos.',
      href: '/circuito',
      cta: 'Ver Circuito OWA',
    },
    {
      icono: 'trofeo',
      t: 'Busco un gran desafío',
      d: 'Tengo experiencia en aguas abiertas, preparación específica y quiero enfrentar distancias de mayor exigencia.',
      destino: 'Grand Prix OWA',
      detalle: 'La propuesta competitiva de OWA para quienes buscan mayores distancias y un nivel de exigencia superior.',
      href: '/grand-prix',
      cta: 'Ver Grand Prix OWA',
    },
  ],
};

export const HABILIDADES = {
  titulo: 'De la pileta al agua abierta',
  lead: 'Tu primera experiencia no consiste solamente en nadar más metros.<br>Hay algunas habilidades y sensaciones nuevas que vas a incorporar.',
  items: [
    {
      icono: 'brujula',
      t: 'Orientación',
      d: 'En la pileta, la línea y el borde te muestran el camino. En aguas abiertas vas a aprender a levantar la vista y utilizar referencias para mantener el rumbo.',
    },
    {
      icono: 'ola',
      t: 'Respiración y condiciones',
      d: 'Viento, olas, corriente y temperatura pueden hacer que cada experiencia sea diferente.',
    },
    {
      icono: 'equipo',
      t: 'Nadar acompañado',
      d: 'En una carrera vas a compartir el agua con otros nadadores. Aprender a sentirte cómodo cerca de otras personas también forma parte de la experiencia.',
    },
    {
      icono: 'gota',
      t: 'Equipamiento',
      d: 'Antiparras, gorra y, dependiendo de las condiciones y del reglamento de cada prueba, traje de neopreno.',
    },
    {
      icono: 'cupo',
      t: 'Boya de seguridad',
      d: 'En los eventos <span class="u-sigla">OWA</span> el uso de boya de flotación es obligatorio para los participantes de las pruebas en las que así lo establece el reglamento. Antes de tu carrera, consultá en el micrositio correspondiente los elementos obligatorios y las condiciones específicas de la prueba.',
    },
    {
      icono: 'pin',
      t: 'Conocer el recorrido',
      d: 'Antes de largar es importante conocer dónde vas a nadar, las características del circuito y las indicaciones de la organización. Toda esta información está disponible en el micrositio de cada evento y se complementa con la charla técnica correspondiente.',
    },
  ],
};

export const ETAPAS = {
  titulo: 'Tu primera carrera OWA',
  lead: 'Elegir una distancia adecuada es solamente una parte. También queremos que sepas qué vas a encontrar cuando llegues.',
  items: [
    {
      t: 'Antes de largar',
      d: [
        'Vas a realizar la acreditación, recibir tu kit y acceder a la información técnica de tu carrera.',
        'Antes de ingresar al agua vas a conocer las indicaciones particulares del recorrido y las condiciones previstas para la prueba.',
      ],
    },
    {
      t: 'En el agua',
      d: [
        'Encontrarás un recorrido señalizado y un dispositivo de seguridad acorde a las características de la competencia.',
        'El staff de organización realiza el seguimiento de la prueba y el dispositivo de seguridad está preparado para asistir a los participantes cuando sea necesario.',
      ],
    },
    {
      t: 'Cuando llegás',
      d: [
        'Cronometraje, resultados y los reconocimientos correspondientes a cada prueba.',
        'Pero para alguien que está viviendo su primera experiencia probablemente haya algo más importante:',
      ],
    },
  ],
  destacado: 'La satisfacción de haber hecho algo que hasta hace poco parecía difícil o desconocido.',
};

export const ACOMPANADO = {
  kicker: 'En comunidad',
  titulo: 'Empezar es más fácil cuando lo hacés acompañado',
  parrafos: [
    'Muchos nadadores llegan a <span class="u-sigla">OWA</span> desde una pileta, un club o un equipo y participan por primera vez en aguas abiertas.',
    'En nuestros eventos vas a encontrarte con personas de diferentes edades, experiencias y objetivos.',
    'Algunos van a competir. Otros intentarán mejorar su tiempo. Y otros estarán ahí simplemente para completar por primera vez una distancia en aguas abiertas.',
    'Si entrenás con un equipo, podés vivir la experiencia junto a ellos. También podés invitar a un amigo o amiga que nade con vos.',
    'Y si todavía no pertenecés a ningún grupo, podés contactarnos. Según tu zona, podemos orientarte sobre equipos o grupos que habitualmente participan de nuestros eventos.',
  ],
  destacado: 'Porque entrar al agua acompañado puede hacer que el primer paso sea mucho más fácil.',
};

export const KIDS = {
  kicker: 'Prueba Kids',
  titulo: 'Los más chicos también pueden ser parte',
  // Los dos datos duros de la prueba, que en el documento están dentro del
  // primer párrafo: acá se muestran aparte para que se vean de entrada.
  datos: [
    { icono: 'ondas', t: '500 metros' },
    { icono: 'equipo', t: 'Menores de 13 años' },
  ],
  items: [
    {
      icono: 'ondas',
      texto:
        'En determinados encuentros <span class="u-sigla">OWA</span> incorporamos una prueba Kids de 500 metros, destinada a nadadores menores de 13 años.',
    },
    {
      icono: 'persona',
      texto:
        'Es una propuesta diferenciada de las distancias para adultos y busca que los más chicos también puedan vivir la experiencia de formar parte de un gran encuentro de aguas abiertas.',
    },
    {
      icono: 'escudo',
      texto: 'Consultá en cada evento la disponibilidad, condiciones y requisitos de la prueba Kids.',
    },
  ],
};

// "Nivel recomendado" por modalidad, para completar las cinco cards que ya
// existen en madres.js (MODALIDADES) sin duplicar título/desc/foto/href.
export const NIVELES_MODALIDAD = {
  '/grand-prix': 'Medio, alto y competitivo.',
  '/circuito': 'Inicial, medio y competitivo.',
  '/especiales': 'Según el evento.',
  '/challenge': 'Alto.',
  '/travel': 'Inicial, medio, alto y competitivo, según la experiencia.',
};

export const CIERRE = {
  titulo: 'Vos elegís hasta dónde querés llegar',
  intro:
    'No necesitás pensar hoy en <span class="u-sigla">GRAND PRIX</span>, <span class="u-sigla">CHALLENGE</span> o en nadar kilómetros y kilómetros.',
  // Va aparte del resto: es la frase bisagra del cierre y se muestra en
  // display, no como un párrafo más.
  enfasis: 'Primero está tu primera experiencia.',
  parrafos: [
    'Después quizá quieras nadar un poco más. Competir. Viajar con tu equipo. Conocer otro río. Nadar en el mar. Participar de una carrera histórica. O algún día enfrentarte a una ultradistancia.',
    'En los 10 años de <span class="u-sigla">OWA</span> vimos a muchos nadadores comenzar con sus primeras experiencias y, con el tiempo, descubrir hasta dónde podían llegar.',
  ],
  destacados: ['No hay un único camino.', 'Empezá por el desafío que hoy es para vos.'],
};

export const CTA_FINAL = {
  titulo: '¿Listo para empezar?',
  lead: 'No necesitás elegir entre todas las experiencias <span class="u-sigla">OWA</span>. Sólo necesitás encontrar la primera.',
};
