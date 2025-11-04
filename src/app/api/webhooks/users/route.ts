import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { getDbAsync } from '@/lib/db';

export async function POST(req: Request) {
  // Obtén el secreto del webhook de las variables de entorno
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Por favor agrega CLERK_WEBHOOK_SECRET en las variables de entorno');
  }

  // Obtén los headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // Si faltan headers, retorna error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Headers faltantes', {
      status: 400,
    });
  }

  // Obtén el body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Crea una nueva instancia de Svix con el secreto
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verifica el webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verificando webhook:', err);
    return new Response('Error: Verificación fallida', {
      status: 400,
    });
  }

  // Obtén la instancia de la base de datos
  const db = await getDbAsync();

  // Maneja el evento
  const eventType = evt.type;

  try {
    if (eventType === 'user.created') {
      const { id, username, email_addresses } = evt.data;
      
      // Extrae el username con prioridad: username > email > id
      const finalUsername = 
        username || 
        email_addresses[0]?.email_address?.split('@')[0];
      
      // Guarda el usuario en la base de datos
      await db.user.create({
        data: {
          clerkId: id,
          username: finalUsername,
        },
      });
      
      console.log(`✅ Usuario creado en la BD: ${id} (${finalUsername})`);
    }

    if (eventType === 'user.updated') {
      const { id, username, email_addresses } = evt.data;
      
      const finalUsername = 
        username || 
        email_addresses[0]?.email_address?.split('@')[0];
      
      // Actualiza el usuario en la base de datos
      await db.user.update({
        where: { clerkId: id },
        data: {
          username: finalUsername,
        },
      });
      
      console.log(`✅ Usuario actualizado en la BD: ${id} (${finalUsername})`);
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;
      
      // Elimina el usuario de la base de datos
      // Las relaciones en cascada eliminarán automáticamente
      await db.user.delete({
        where: { clerkId: id },
      });
      
      console.log(`✅ Usuario eliminado de la BD: ${id}`);
    }

    return new Response('Webhook procesado correctamente', { status: 200 });
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    return new Response('Error: No se pudo procesar el webhook', {
      status: 500,
    });
  }
}