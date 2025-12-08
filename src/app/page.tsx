'use client'; // Isso avisa ao Next.js para rodar esse arquivo como React normal (Client Side)

// IMPORTANTE: Confira se o caminho '@views/Home' está certo.
// Se você renomeou a pasta 'pages' para 'views', e o arquivo é 'Home.tsx', deve ser algo assim:
import HomeAntiga from '@/views/Home'; 

export default function Page() {
  return <HomeAntiga />;
}