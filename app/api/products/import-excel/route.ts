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
    const tempFilePath = join(tmpdir(), `import_${sessionId}_${Date.now()}.xlsx`);
    
    try {
      await writeFile(tempFilePath, buffer);

      // Procesar importación de forma asíncrona
      // No esperamos a que termine, retornamos inmediatamente
      // El progreso se enviará via SSE
      storage.importProductsFromExcel(tempFilePath, sessionId)
        .then(async (result) => {
          // Limpiar archivo temporal
          try {
            await unlink(tempFilePath);
          } catch (error) {
            console.error('Error deleting temp file:', error);
          }

          // Enviar progreso final
          if (global.importProgress?.has(sessionId)) {
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
          }
        })
        .catch(async (error) => {
          // Limpiar archivo temporal en caso de error
          try {
            await unlink(tempFilePath);
          } catch (unlinkError) {
            console.error('Error deleting temp file:', unlinkError);
          }

          // Enviar error
          if (global.importProgress?.has(sessionId)) {
            global.importProgress.get(sessionId)!({
              type: 'error',
              message: `Error durante la importación: ${error.message || 'Error desconocido'}`,
              errors: 1
            });
            setTimeout(() => {
              global.importProgress?.delete(sessionId);
            }, 5000);
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

