import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.dolarvzla.com/public/exchange-rate', {
      headers: {
        'User-Agent': 'FV-Bodegon/1.0',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // La nueva API tiene estructura: { current: { usd: number, eur: number, date: string }, ... }
    if (!data?.current?.usd || typeof data.current.usd !== 'number' || data.current.usd <= 0) {
      throw new Error('Tasa inválida recibida');
    }
    
    // Adaptar a la estructura esperada por el frontend
    const rateData = {
      promedio: data.current.usd,
      nombre: 'Dólar Oficial (BCV)',
      fechaActualizacion: data.current.date,
      compra: data.current.usd,
      venta: data.current.usd,
      fuente: 'api.dolarvzla.com'
    };
    
    return NextResponse.json(rateData);
  } catch (error: any) {
    console.error('Error fetching dollar rate:', error);
    return NextResponse.json({ 
      error: error.message || 'No se pudo obtener la tasa del dólar' 
    }, { status: 500 });
  }
}

