export async function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      const maxLongSide = 2048;
      const maxShortSide = 768;
      
      if (width > height) {
        if (width > maxLongSide) {
          height = Math.round((height * maxLongSide) / width);
          width = maxLongSide;
        }
        if (height > maxShortSide) {
          width = Math.round((width * maxShortSide) / height);
          height = maxShortSide;
        }
      } else {
        if (height > maxLongSide) {
          width = Math.round((width * maxLongSide) / height);
          height = maxLongSide;
        }
        if (width > maxShortSide) {
          height = Math.round((height * maxShortSide) / width);
          width = maxShortSide;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 and remove the data URL prefix
      const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      resolve(base64);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}
