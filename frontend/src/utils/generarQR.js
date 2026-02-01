import QRCode from 'qrcode';

export const generarQR = async (texto, nombreArchivo) => {
  try {
    // Generar QR como data URL
    const qrDataURL = await QRCode.toDataURL(texto, {
      width: 400,
      margin: 2,
      color: {
        dark: '#012E40',
        light: '#FFFFFF'
      }
    });
    
    // Crear enlace de descarga
    const link = document.createElement('a');
    link.href = qrDataURL;
    link.download = `${nombreArchivo}_QR.png`;
    link.click();
    
    return qrDataURL;
  } catch (error) {
    console.error('Error generando QR:', error);
    throw error;
  }
};

export const obtenerQRDataURL = async (texto) => {
  try {
    const qrDataURL = await QRCode.toDataURL(texto, {
      width: 400,
      margin: 2,
      color: {
        dark: '#012E40',
        light: '#FFFFFF'
      }
    });
    return qrDataURL;
  } catch (error) {
    console.error('Error generando QR:', error);
    throw error;
  }
};