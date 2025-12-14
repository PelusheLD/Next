import { NextRequest } from 'next/server';

// Inicializar global.importProgress si no existe
if (!global.importProgress) {
  (global as any).importProgress = new Map<string, (data: any) => void>();
}

// Declarar tipo global
declare global {
  var importProgress: Map<string, (data: any) => void> | undefined;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  // Crear un ReadableStream para Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      // Función para enviar datos
      const send = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(new TextEncoder().encode(message));
      };

      // Enviar mensaje de conexión
      send({ type: 'connected', message: 'Conectado al servidor' });
      console.log('SSE endpoint: Connection established for sessionId:', sessionId);

      // Configurar callback para recibir progreso
      const progressCallback = (data: any) => {
        console.log('SSE endpoint: Progress callback called with data:', data);
        try {
          send(data);
        } catch (error) {
          console.error('SSE endpoint: Error sending data:', error);
        }
        
        // Cerrar conexión si es complete o error
        if (data.type === 'complete' || data.type === 'error') {
          setTimeout(() => {
            controller.close();
            console.log('SSE endpoint: Connection closed');
          }, 1000);
        }
      };

      // Registrar callback en el Map global
      if (!global.importProgress) {
        (global as any).importProgress = new Map();
      }
      if (global.importProgress) {
        global.importProgress.set(sessionId, progressCallback);
        console.log('SSE endpoint: Callback registered for sessionId:', sessionId);
        console.log('SSE endpoint: Total callbacks:', global.importProgress.size);
      }

      // Limpiar cuando el cliente se desconecte
      request.signal.addEventListener('abort', () => {
        global.importProgress?.delete(sessionId);
        controller.close();
      });

      // Heartbeat para mantener la conexión viva
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(': heartbeat\n\n'));
        } catch (error) {
          clearInterval(heartbeat);
          controller.close();
        }
      }, 30000); // Cada 30 segundos

      // Limpiar heartbeat cuando se cierre
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
      });
    },
  });

  // Retornar respuesta SSE
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Deshabilitar buffering en Nginx
    },
  });
}

