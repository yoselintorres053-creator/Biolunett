// ===== Biolunet — Contenido académico =====
const DATA = {};

// --- GENÉTICA ---
DATA.genetica = {
  intro: 'Todo ser vivo guarda una historia escrita en su ADN. Algunas historias describen organismos complejos; otras explican la evolución de especies. Pero las más interesantes son las que hablan de personas que nunca dejan de aprender.',
  resumenes: [
    ['ADN', 'El ácido desoxirribonucleico es la molécula que almacena la información genética. Es una doble hélice formada por nucleótidos (A-T, G-C). Su secuencia codifica las instrucciones para construir proteínas.'],
    ['ARN', 'El ácido ribonucleico es de cadena sencilla y usa uracilo (U) en lugar de timina. Tipos: ARNm (mensajero), ARNt (transferencia) y ARNr (ribosómico). Transporta y traduce la información del ADN.'],
    ['Genes', 'Un gen es un segmento de ADN que codifica un producto funcional (proteína o ARN). Los alelos son versiones alternativas de un gen que determinan las variaciones de un rasgo.'],
    ['Cromosomas', 'Estructuras de ADN altamente compactado con proteínas (histonas). El ser humano tiene 46 cromosomas (23 pares). El cariotipo es su representación ordenada.'],
    ['Mutaciones', 'Cambios en la secuencia del ADN. Pueden ser puntuales (sustitución, inserción, deleción) o cromosómicas. Son la materia prima de la evolución y fuente de variabilidad.'],
    ['Replicación', 'Proceso semiconservativo por el que el ADN se duplica antes de la división celular. Participan helicasa, ADN polimerasa y ligasa. Cada nueva molécula conserva una hebra original.'],
    ['Transcripción', 'Síntesis de ARNm a partir de una hebra molde de ADN, catalizada por la ARN polimerasa. Ocurre en el núcleo en eucariotas.'],
    ['Traducción', 'El ribosoma lee el ARNm en codones (tripletes) y ensambla aminoácidos para formar una proteína. El ARNt aporta los aminoácidos según el anticodón.']
  ],
  flashcards: [
    ['¿Qué bases se emparejan en el ADN?', 'Adenina–Timina (A–T) y Guanina–Citosina (G–C).'],
    ['¿Qué diferencia al ARN del ADN?', 'El ARN es de cadena sencilla, usa ribosa y uracilo (U) en vez de timina.'],
    ['¿Qué es un codón?', 'Triplete de nucleótidos del ARNm que codifica un aminoácido o una señal de inicio/paro.'],
    ['¿Qué enzima sintetiza ARN?', 'La ARN polimerasa.'],
    ['¿Qué significa replicación semiconservativa?', 'Cada molécula hija conserva una hebra original y una nueva.'],
    ['¿Qué es un alelo?', 'Cada una de las versiones alternativas de un gen.']
  ],
  glosario: [
    ['Genotipo', 'Conjunto de alelos que posee un organismo (p. ej. Aa).'],
    ['Fenotipo', 'Característica observable resultante del genotipo y el ambiente.'],
    ['Homocigoto', 'Individuo con dos alelos iguales (AA o aa).'],
    ['Heterocigoto', 'Individuo con dos alelos diferentes (Aa).'],
    ['Dominante', 'Alelo que se expresa aunque esté en una sola copia.'],
    ['Recesivo', 'Alelo que solo se expresa en homocigosis.']
  ],
  quiz: [
    ['¿Qué base NO aparece en el ARN?', ['Timina','Uracilo','Adenina','Citosina'], 0, 'El ARN usa uracilo en lugar de timina.'],
    ['El cruce Aa × Aa produce una proporción fenotípica de:', ['1:1','3:1','9:3:3:1','2:1'], 1, 'Dominante:recesivo = 3:1 en un monohíbrido.'],
    ['La traducción ocurre en el:', ['Núcleo','Ribosoma','Aparato de Golgi','Lisosoma'], 1, 'El ribosoma ensambla la proteína leyendo el ARNm.'],
    ['El ser humano tiene cuántos pares de cromosomas:', ['46','23','22','48'], 1, '23 pares = 46 cromosomas en total.']
  ]
};

// --- DINÁMICA TERRESTRE ---
DATA.tierra = {
  intro: 'La Tierra conserva registros de eventos ocurridos hace millones de años. Cada roca cuenta una parte de la historia del planeta. Y cada descubrimiento comienza con alguien dispuesto a hacer preguntas.',
  eras: [
    ['Precámbrico', '4600–541 millones de años', 'Abarca casi el 88% de la historia terrestre. Se forma la Tierra, los océanos y la atmósfera primitiva. Aparece la vida procariota y, con la fotosíntesis de las cianobacterias, el oxígeno atmosférico (Gran Oxidación).', 'Estromatolitos, cianobacterias, primeros eucariotas.'],
    ['Paleozoico', '541–252 millones de años', 'La “era de la vida antigua”. Explosión del Cámbrico, colonización de la tierra firme por plantas y artrópodos, primeros peces, anfibios y reptiles. Termina con la mayor extinción conocida.', 'Trilobites, peces óseos, helechos gigantes, anfibios.'],
    ['Mesozoico', '252–66 millones de años', 'La “era de los dinosaurios”. Dominan los reptiles; aparecen aves, mamíferos primitivos y plantas con flor. Finaliza con la extinción del límite K-Pg.', 'Dinosaurios, ammonites, primeras aves y angiospermas.'],
    ['Cenozoico', '66 millones de años – actualidad', 'La “era de los mamíferos”. Diversificación de mamíferos y aves, aparición de los primates y, finalmente, del ser humano. Grandes glaciaciones.', 'Mamíferos, aves modernas, homininos, plantas con flor.']
  ],
  extinciones: [
    ['Ordovícico-Silúrico', '~444 Ma', 'Glaciación; ~85% de especies marinas.'],
    ['Devónico tardío', '~372 Ma', 'Múltiples pulsos; afectó arrecifes y vida marina.'],
    ['Pérmico-Triásico', '~252 Ma', 'La “Gran Mortandad”; hasta 96% de especies marinas.'],
    ['Triásico-Jurásico', '~201 Ma', 'Abrió paso al dominio de los dinosaurios.'],
    ['Cretácico-Paleogeno', '~66 Ma', 'Impacto de asteroide; fin de los dinosaurios no avianos.']
  ],
  quiz: [
    ['¿En qué era dominaron los dinosaurios?', ['Paleozoico','Mesozoico','Cenozoico','Precámbrico'], 1, 'El Mesozoico es la era de los dinosaurios.'],
    ['La mayor extinción masiva ocurrió en el límite:', ['K-Pg','Pérmico-Triásico','Ordovícico','Devónico'], 1, 'La Gran Mortandad P-T eliminó hasta el 96% de especies marinas.'],
    ['El oxígeno atmosférico aumentó gracias a:', ['Los dinosaurios','Las cianobacterias','Los mamíferos','Los trilobites'], 1, 'La fotosíntesis de cianobacterias causó la Gran Oxidación.'],
    ['Los primeros primates aparecen en el:', ['Mesozoico','Cenozoico','Paleozoico','Precámbrico'], 1, 'El Cenozoico es la era de los mamíferos y primates.']
  ]
};

// --- ECOLOGÍA ---
DATA.ecologia = {
  intro: 'Ningún organismo existe completamente aislado. Todos forman parte de redes complejas donde cada acción genera consecuencias. Comprender esas conexiones es una de las formas más hermosas de estudiar la vida.',
  ecosistemas: [
    ['Bosque templado', '🌳', 'Cuatro estaciones marcadas, árboles caducifolios, suelo rico en materia orgánica.'],
    ['Selva tropical', '🌴', 'Alta biodiversidad, clima cálido y húmedo, estratificación vertical del dosel.'],
    ['Desierto', '🏜️', 'Escasa precipitación, gran amplitud térmica, organismos adaptados a la sequía.'],
    ['Tundra', '❄️', 'Frío extremo, permafrost, vegetación baja (musgos y líquenes).'],
    ['Pastizal', '🌾', 'Dominado por gramíneas, base de grandes herbívoros.'],
    ['Marino', '🌊', 'Cubre el 70% del planeta; del plancton a los grandes depredadores.']
  ],
  relaciones: [
    ['Mutualismo', 'Ambas especies se benefician (abeja–flor).'],
    ['Comensalismo', 'Una se beneficia y la otra no se ve afectada (rémora–tiburón).'],
    ['Parasitismo', 'Una se beneficia a costa de la otra (garrapata–mamífero).'],
    ['Depredación', 'Un organismo captura y consume a otro (león–cebra).'],
    ['Competencia', 'Dos especies compiten por el mismo recurso.']
  ],
  ciclos: [
    ['Ciclo del agua', 'Evaporación, condensación, precipitación e infiltración mueven el agua entre atmósfera, tierra y océano.'],
    ['Ciclo del carbono', 'El CO₂ pasa por fotosíntesis, respiración, descomposición y combustión entre seres vivos, atmósfera y suelos.'],
    ['Ciclo del nitrógeno', 'Fijación, nitrificación, asimilación y desnitrificación; bacterias clave transforman el N₂.'],
    ['Ciclo del fósforo', 'Sin fase gaseosa; va de rocas a suelo, seres vivos y sedimentos. Es limitante en muchos ecosistemas.']
  ],
  flashcards: [
    ['¿Qué relación beneficia a ambas especies?', 'El mutualismo.'],
    ['¿Qué nivel trófico ocupan las plantas?', 'Productores (primer nivel).'],
    ['¿Qué ciclo carece de fase gaseosa?', 'El ciclo del fósforo.'],
    ['¿Qué organismos fijan el nitrógeno?', 'Bacterias fijadoras (p. ej. Rhizobium).']
  ],
  quiz: [
    ['La relación rémora–tiburón es un ejemplo de:', ['Mutualismo','Comensalismo','Parasitismo','Depredación'], 1, 'La rémora se beneficia sin afectar al tiburón.'],
    ['Los organismos que fabrican su propio alimento son:', ['Consumidores','Descomponedores','Productores','Depredadores'], 2, 'Los productores realizan fotosíntesis.'],
    ['¿Qué ciclo NO tiene fase gaseosa importante?', ['Carbono','Nitrógeno','Agua','Fósforo'], 3, 'El fósforo se mueve por rocas y sedimentos.'],
    ['En una cadena, la energía fluye:', ['De consumidores a productores','En un solo sentido, desde los productores','En círculo cerrado','De depredadores a plantas'], 1, 'La energía fluye unidireccionalmente y se pierde como calor.']
  ]
};

// --- MODELOS BIOMATEMÁTICOS ---
DATA.biomate = {
  intro: 'La naturaleza parece caótica. Sin embargo, detrás de muchos procesos biológicos existen patrones que pueden describirse mediante matemáticas. Observar esos patrones es otra forma de descubrir la belleza de la vida.',
  formulas: [
    ['Modelo exponencial', 'N(t) = N₀ · e^(r·t)', 'Crecimiento sin límites; válido cuando los recursos son abundantes.'],
    ['Modelo logístico', 'N(t) = K / (1 + ((K−N₀)/N₀)·e^(−r·t))', 'Crecimiento limitado por la capacidad de carga K del ambiente.']
  ],
  ejercicios: [
    ['Una población de bacterias parte de 500 individuos con r = 0.3 por hora. ¿Cuántas habrá tras 5 horas (modelo exponencial)?',
     ['Aplicamos N(t)=N₀·e^(r·t).','Sustituimos: N(5)=500·e^(0.3·5)=500·e^(1.5).','e^1.5 ≈ 4.4817.','N(5) ≈ 500 · 4.4817 ≈ 2241 bacterias.']],
    ['Un ecosistema tiene K = 1000 venados, N₀ = 100 y r = 0.5/año. Describe el crecimiento logístico.',
     ['Usamos N(t)=K/(1+((K−N₀)/N₀)·e^(−r·t)).','El término (K−N₀)/N₀ = (1000−100)/100 = 9.','Al inicio crece casi exponencialmente; al acercarse a K la tasa cae.','La población se estabiliza asintóticamente en K = 1000 venados.']]
  ],
  quiz: [
    ['El modelo exponencial supone que los recursos son:', ['Limitados','Ilimitados','Nulos','Cíclicos'], 1, 'Sin límite de recursos el crecimiento es exponencial.'],
    ['En el modelo logístico, K representa:', ['La tasa de crecimiento','El tiempo','La capacidad de carga','La población inicial'], 2, 'K es el máximo que el ambiente sostiene.'],
    ['La curva logística tiene forma de:', ['Línea recta','J','S (sigmoide)','Parábola'], 2, 'Es una curva sigmoide que se aplana en K.']
  ]
};

// Metadatos de materias para la portada
DATA.subjects = [
  ['genetica', '🧬', 'Bases Genéticas de la Vida', 'ADN, herencia y cuadros de Punnett'],
  ['tierra', '🌎', 'Dinámica Terrestre', 'Eras geológicas y extinciones'],
  ['ecologia', '🌿', 'Ecología', 'Ecosistemas, relaciones y ciclos'],
  ['biomate', '📈', 'Modelos Biomatemáticos I', 'Crecimiento poblacional y gráficas']
];
