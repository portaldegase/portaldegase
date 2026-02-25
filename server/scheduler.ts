import * as db from "./db";

/**
 * Publicador automático de posts agendados
 * Deve ser executado periodicamente (a cada minuto) para verificar e publicar posts agendados
 */
export async function publishScheduledPosts() {
  try {
    const scheduledPosts = await db.getScheduledPosts();
    
    if (scheduledPosts.length === 0) {
      console.log("[Scheduler] Nenhum post agendado para publicar neste momento");
      return { published: 0, errors: 0 };
    }

    console.log(`[Scheduler] Encontrados ${scheduledPosts.length} posts agendados para publicar`);

    let published = 0;
    let errors = 0;

    for (const post of scheduledPosts) {
      try {
        await db.publishScheduledPost(post.id);
        console.log(`[Scheduler] Post ${post.id} publicado com sucesso: "${post.title}"`);
        published++;
      } catch (error) {
        console.error(`[Scheduler] Erro ao publicar post ${post.id}:`, error);
        errors++;
      }
    }

    console.log(`[Scheduler] Resumo: ${published} publicados, ${errors} erros`);
    return { published, errors };
  } catch (error) {
    console.error("[Scheduler] Erro ao executar publicador de posts agendados:", error);
    return { published: 0, errors: 1 };
  }
}

/**
 * Inicia o scheduler para executar a cada minuto
 * Chame esta função na inicialização do servidor
 */
export function startScheduler(intervalMs: number = 60000) {
  console.log("[Scheduler] Iniciando publicador de posts agendados...");
  
  // Executar imediatamente na inicialização
  publishScheduledPosts().catch(console.error);

  // Executar a cada intervalo (padrão: 60 segundos)
  const interval = setInterval(() => {
    publishScheduledPosts().catch(console.error);
  }, intervalMs);

  return interval;
}
