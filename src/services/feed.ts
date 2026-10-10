import { FeedResponse, BlogPost } from '../types/blog';
import { getStoredFeed, saveFeedToStorage, isPostSavedOffline } from './storage';

// Initial snapshot in case of first-run offline scenario
const INITIAL_SNAPSHOT: FeedResponse = {
  channel: {
    title: 'TeoNexus',
    description: 'Pensar la fe con profundidad, vivirla con sencillez.',
    link: 'https://csalazar.org',
    lastBuildDate: 'Fri, 09 Oct 2026 07:59:56 +0000',
    language: 'es',
    image: 'https://csalazar.org/wp-content/uploads/2026/09/cropped-csalazar-org.png?w=32',
  },
  posts: [
    {
      id: 'http://csalazar.org/?p=23005',
      title: 'El camino de Damasco: cuando Dios confronta nuestras certezas',
      link: 'https://csalazar.org/2026/09/27/el-camino-de-damasco-cuando-dios-confronta-nuestras-certezas/',
      pubDate: 'Mon, 28 Sep 2026 05:40:37 +0000',
      formattedDate: '28 de septiembre de 2026',
      author: 'Carlos Salazar',
      categories: ['Teología y Apologética'],
      excerpt: 'Hay algo más difícil de recuperar que la fe: la capacidad de dudar de uno mismo. Perder la fe duele, se nota; sabes que algo se rompió. Pero perder la capacidad de cuestionarte no duele…',
      featuredImage: 'https://csalazar.org/wp-content/uploads/2026/09/image.png?w=1024',
      authorAvatar: 'https://1.gravatar.com/avatar/a14c912ab081efb57450b299edaeda0bf778e1fc94f5514598de0ef54fa38cf5?s=96',
      content: `<p>Hay algo más difícil de recuperar que la fe: la capacidad de dudar de uno mismo.</p><p>Perder la fe duele, se nota; sabes que algo se rompió. Pero perder la capacidad de cuestionarte no duele. No se nota. Un día simplemente dejas de escuchar al que piensa distinto, dejas de leer lo que incomoda, dejas de preguntarte si podrías estar equivocado. Y te sientes bien, te sientes firme, te sientes en casa.</p><p>Saulo de Tarso no iba camino a Damasco con dudas. Iba con certezas blindadas. Llevaba cartas oficiales, la ley de su lado, la convicción moral más pura que un hombre religioso puede tener. No era un hipócrita; era un creyente sincero. Y precisamente por eso era peligroso.</p><blockquote>La mayor ceguera espiritual rara vez proviene del ateísmo; suele brotar de una devoción que confundió sus propias conclusiones con la voz de Dios.</blockquote><p>Cuando la luz lo derribó, la primera pregunta no fue doctrinal. No fue sobre la ley ni el templo. Fue una pregunta sobre personas: <em>«¿Por qué me persigues?»</em>. Dios confrontó su sistema recordándole que la teología que lastima al prójimo nunca viene del cielo.</p>`,
      readingTimeMinutes: 4,
    },
    {
      id: 'http://csalazar.org/?p=22027',
      title: 'La IA Puede Crear Canciones, Pero ¿Puede Crear Adoradores?',
      link: 'https://csalazar.org/2026/08/25/la-ia-puede-crear-canciones-pero-puede-crear-adoradores/',
      pubDate: 'Tue, 25 Aug 2026 06:58:01 +0000',
      formattedDate: '25 de agosto de 2026',
      author: 'Carlos Salazar',
      categories: ['Fe, Cultura y Sociedad'],
      excerpt: 'En cuestión de segundos, un modelo de lenguaje y sonido puede componer una balada de alabanza con rimas impecables y armonías emotivas. Sin embargo, surge una pregunta ineludible…',
      featuredImage: 'https://csalazar.org/wp-content/uploads/2026/08/image.png?w=1024',
      authorAvatar: 'https://1.gravatar.com/avatar/a14c912ab081efb57450b299edaeda0bf778e1fc94f5514598de0ef54fa38cf5?s=96',
      content: `<p>En cuestión de segundos, un modelo generativo de audio puede producir una canción de alabanza con armonías conmovedoras, acordes suspendidos y letras que encajarían en cualquier servicio dominical.</p><p>La técnica es asombrosa, pero nos obliga a hacer una pausa teológica: <strong>la adoración nunca ha sido sobre la acústica, sino sobre la entrega</strong>.</p><p>Una máquina puede combinar patrones sintácticos aprendidos de miles de canciones previas. Puede replicar la cadencia del quebranto y el clímax emocional del coro. Lo que no puede hacer es experimentar la gracia, derramar lágrimas de arrepentimiento ni elegir someter su voluntad ante el Creador.</p><blockquote>Dios no busca canciones perfectas; busca adoradores en espíritu y en verdad.</blockquote><p>El desafío para la iglesia contemporánea no es temer a la inteligencia artificial, sino examinar si nuestras propias liturgias no se habían vuelto ya mecánicas antes de que aparecieran los algoritmos.</p>`,
      readingTimeMinutes: 5,
    },
    {
      id: 'http://csalazar.org/?p=21952',
      title: 'El Poder de Estar con Jesús: Una lección de Hechos 4:13',
      link: 'https://csalazar.org/2026/08/12/el-poder-de-estar-con-jesus-una-leccion-de-hechos-413/',
      pubDate: 'Thu, 13 Aug 2026 05:25:40 +0000',
      formattedDate: '13 de agosto de 2026',
      author: 'Carlos Salazar',
      categories: ['Iglesia, Liderazgo y Ministerio'],
      excerpt: 'Cuando los líderes religiosos vieron el denuedo de Pedro y Juan, y sabían que eran hombres sin letras y del vulgo, se maravillaban; y les reconocían que habían estado con Jesús.',
      featuredImage: 'https://csalazar.org/wp-content/uploads/2026/08/gemini_generated_image_jadx5njadx5njadx-1.png?w=1024',
      authorAvatar: 'https://1.gravatar.com/avatar/a14c912ab081efb57450b299edaeda0bf778e1fc94f5514598de0ef54fa38cf5?s=96',
      content: `<p>En Hechos 4 encontramos un escenario fascinante: los apóstoles frente al tribunal más respetado de su época. Hombres instruidos en las academias rabínicas, versados en la retórica y la ley.</p><p>Sin embargo, el texto bíblico registra un asombro genuino: reconocieron que eran hombres sencillos, sin títulos formales, pero con una autoridad moral y un denuedo imposible de ignorar.</p><blockquote>«Y les reconocían que habían estado con Jesús» (Hechos 4:13).</blockquote><p>No fue su elocuencia lo que desarmó al concilio; fue la evidencia irrefutable del tiempo compartido con el Maestro. En una época obsesionada con las credenciales y las marcas personales, este pasaje nos recuerda la fuente primordial de toda influencia transformadora: la intimidad con Cristo.</p>`,
      readingTimeMinutes: 4,
    },
    {
      id: 'http://csalazar.org/?p=21440',
      title: 'Teología del Sueño: Cómo el Cambio Climático Nos Roba el Descanso',
      link: 'https://csalazar.org/2026/08/04/teologia-del-sueno-como-el-cambio-climatico-nos-roba-el-descanso/',
      pubDate: 'Tue, 04 Aug 2026 06:19:46 +0000',
      formattedDate: '4 de agosto de 2026',
      author: 'Carlos Salazar',
      categories: ['Fe, Cultura y Sociedad'],
      excerpt: 'Dormir no es un mero proceso biológico; es un acto de fe. En las Escrituras, el descanso físico y el shabbat reflejan la confianza en que el mundo no depende de nuestro control incesante.',
      featuredImage: 'https://csalazar.org/wp-content/uploads/2026/08/pexels-photo-33075262.jpeg?w=900',
      authorAvatar: 'https://1.gravatar.com/avatar/a14c912ab081efb57450b299edaeda0bf778e1fc94f5514598de0ef54fa38cf5?s=96',
      content: `<p>El Salmo 127 nos confronta con una verdad poética: <em>«Por demás es que os levantéis de madrugada, y vayáis tarde a reposar... pues que a su amado dará Dios el sueño»</em>.</p><p>El descanso es una disciplina teológica. Cerrar los ojos cada noche es confesar silenciosamente: <strong>«Dios reina y yo no soy el sustentador del universo»</strong>.</p><p>Cuando las temperaturas nocturnas suben y los patrones climáticos alteran el bienestar de comunidades enteras, especialmente las más vulnerables, el problema deja de ser meramente ambiental y se convierte en una cuestión de justicia y mayordomía de la creación.</p>`,
      readingTimeMinutes: 5,
    },
    {
      id: 'http://csalazar.org/?p=21426',
      title: 'La Soledad Según La Biblia: De la Trampa del Aislamiento al Refugio de Paz',
      link: 'https://csalazar.org/2026/07/21/la-soledad-segun-la-biblia-de-la-trampa-del-aislamiento-al-refugio-de-paz/',
      pubDate: 'Wed, 22 Jul 2026 05:58:54 +0000',
      formattedDate: '22 de julio de 2026',
      author: 'Carlos Salazar',
      categories: ['Ética, Antropología y Vida Cristiana'],
      excerpt: 'Vivimos en la era más hiperconectada y a la vez más solitaria de la historia humana. La Biblia distingue claramente entre el aislamiento destructivo y el silencio habitado por la presencia divina.',
      featuredImage: 'https://csalazar.org/wp-content/uploads/2026/07/cznmcy1wcml2yxrll3jhd3bpegvsx2ltywdlcy93zwjzaxrlx2nvbnrlbnqvbhivchgxmty4mdq1lwltywdllwt3exf6nnprlmpwzw.webp?w=300',
      authorAvatar: 'https://1.gravatar.com/avatar/a14c912ab081efb57450b299edaeda0bf778e1fc94f5514598de0ef54fa38cf5?s=96',
      content: `<p>Existe una soledad que marchita el alma: aquella que nace del rechazo, del egoísmo o de la desconexión comunitaria. Génesis lo estableció desde el principio: <em>«No es bueno que el hombre esté solo»</em>.</p><p>Pero hay otra soledad muy diferente: la soledad elegida para el retiro, la oración y la renovación. Jesús frecuentemente se apartaba a lugares desiertos para orar en comunión íntima con el Padre.</p><blockquote>El aislamiento huye de los demás; la soledad santa busca a Dios para luego regresar enriquecido a la comunidad.</blockquote><p>Aprender a habitar el silencio sin pánico es uno de los mayores regalos de la madurez espiritual en un mundo lleno de ruido constante.</p>`,
      readingTimeMinutes: 4,
    },
  ],
};

export async function fetchFeed(): Promise<FeedResponse> {
  // If browser is offline, return cache immediately
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const cached = getStoredFeed();
    if (cached) return { ...cached, fromCache: true };
    return { ...INITIAL_SNAPSHOT, fromCache: true };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const res = await fetch('/api/feed', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Error en servidor: ${res.status}`);
    }

    const data: FeedResponse = await res.json();
    
    // Enrich with offline saved status
    data.posts = data.posts.map((post) => ({
      ...post,
      isSavedOffline: isPostSavedOffline(post.id),
    }));

    // Cache locally
    saveFeedToStorage(data);
    return data;
  } catch (err) {
    console.warn('Network feed fetch failed, falling back to local cache', err);
    const cached = getStoredFeed();
    if (cached) {
      return {
        ...cached,
        posts: cached.posts.map((post) => ({
          ...post,
          isSavedOffline: isPostSavedOffline(post.id),
        })),
        fromCache: true,
        stale: true,
      };
    }
    return { ...INITIAL_SNAPSHOT, fromCache: true, stale: true };
  }
}
