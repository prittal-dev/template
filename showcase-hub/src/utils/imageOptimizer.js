/**
 * Client-Side Image Optimizer Utility
 * Automatically resizes and compresses user-uploaded images using HTML Canvas.
 * Prevents browser memory bloat, eliminates input typing lag, and ensures fast persistence.
 */
export async function optimizeImageFile(file, maxWidth = 1200, maxHeight = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Invalid image file'));
    }

    // SVGs can be read directly as lightweight text DataURLs
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio constrained dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight WebP with high compression efficiency
        try {
          const webpDataUrl = canvas.toDataURL('image/webp', quality);
          resolve(webpDataUrl);
        } catch (err) {
          // Fallback to JPEG if WebP encoding is unsupported
          const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(jpegDataUrl);
        }
      };
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Batch optimize multiple files in parallel for instantaneous uploading
 */
export async function optimizeMultipleFiles(files, maxWidth = 900, maxHeight = 900) {
  const fileArray = Array.from(files);
  const tasks = fileArray.map(async (file) => {
    try {
      const optimizedUrl = await optimizeImageFile(file, maxWidth, maxHeight, 0.8);
      return {
        fileName: file.name,
        url: optimizedUrl,
        size: Math.round(optimizedUrl.length * 0.75) // estimated bytes
      };
    } catch (err) {
      console.warn('Skipping unoptimizable file:', file.name, err.message);
      return null;
    }
  });

  const results = await Promise.all(tasks);
  return results.filter(Boolean);
}
