import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { storage } from '@/lib/storage';
import { verifyAuth } from '@/lib/auth';

// Declarar tipo global
declare global {
  var importProgress: Map<string, (data: any) => void> | undefined;
}

// Inicializar global.importProgress si no existe
if (!global.importProgress) {
  (global as any).importProgress = new Map<string, (data: any) => void>();
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Obtener sessionId del header
    const sessionId = request.headers.get('X-Session-ID');
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Obtener el archivo del FormData
    const formData = await request.formData();
    const file = formData.get('excel') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validar tipo de archivo
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/excel',
      'application/x-excel',
      'application/x-msexcel',
    ];
    const isValidType = validTypes.includes(file.type) || 
                       file.name.toLowerCase().endsWith('.xlsx') || 
                       file.name.toLowerCase().endsWith('.xls');
    
    if (!isValidType) {
      return NextResponse.json({ error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)' }, { status: 400 });
    }

    // Guardar archivo temporalmente
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Usar la extensión correcta del archivo original
    const fileExtension = file.name.toLowerCase().endsWith('.xlsx') ? '.xlsx' : '.xls';
    const tempFilePath = join(tmpdir(), `import_${sessionId}_${Date.now()}${fileExtension}`);
    
    try {
      await writeFile(tempFilePath, buffer);
      console.log('File saved to:', tempFilePath);
      console.log('Session ID:', sessionId);
      console.log('Global importProgress exists:', !!global.importProgress);
      console.log('Global importProgress has sessionId:', global.importProgress?.has(sessionId));

      // Esperar un momento para asegurar que el SSE se haya conectado
      // Esto da tiempo para que el cliente establezca la conexión SSE
      await new Promise(resolve => setTimeout(resolve, 500));

      // Procesar importación de forma asíncrona
      // No esperamos a que termine, retornamos inmediatamente
      // El progreso se enviará via SSE
      console.log('Starting import process...');
      storage.importProductsFromExcel(tempFilePath, sessionId)
        .then(async (result) => {
          console.log('Import completed:', result);
          // Limpiar archivo temporal
          try {
            await unlink(tempFilePath);
          } catch (error) {
            console.error('Error deleting temp file:', error);
          }

          // Enviar progreso final
          if (global.importProgress?.has(sessionId)) {
            console.log('Sending complete message to SSE');
            global.importProgress.get(sessionId)!({
              type: 'complete',
              message: `Importación completada. ${result.imported} productos importados, ${result.errors.length} errores.`,
              imported: result.imported,
              errors: result.errors.length
            });
            // Limpiar el callback después de un tiempo
            setTimeout(() => {
              global.importProgress?.delete(sessionId);
            }, 5000);
          } else {
            console.warn('No SSE callback found for sessionId:', sessionId);
          }
        })
        .catch(async (error) => {
          console.error('Import error:', error);
          // Limpiar archivo temporal en caso de error
          try {
            await unlink(tempFilePath);
          } catch (unlinkError) {
            console.error('Error deleting temp file:', unlinkError);
          }

          // Enviar error
          if (global.importProgress?.has(sessionId)) {
            console.log('Sending error message to SSE');
            global.importProgress.get(sessionId)!({
              type: 'error',
              message: `Error durante la importación: ${error.message || 'Error desconocido'}`,
              errors: 1
            });
            setTimeout(() => {
              global.importProgress?.delete(sessionId);
            }, 5000);
          } else {
            console.warn('No SSE callback found for sessionId (error):', sessionId);
          }
        });

      // Retornar respuesta inmediata
      return NextResponse.json({ 
        message: 'Importación iniciada. El progreso se mostrará en tiempo real.',
        sessionId 
      }, { status: 202 }); // 202 Accepted - procesamiento asíncrono

    } catch (error: any) {
      // Limpiar archivo si hay error al guardarlo
      try {
        await unlink(tempFilePath);
      } catch (unlinkError) {
        // Ignorar error si el archivo no existe
      }
      throw error;
    }

  } catch (error: any) {
    console.error('Error in import-excel:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to import products from Excel' 
    }, { status: 500 });
  }
}

