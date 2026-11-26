export async function readSignatureImage(file: File): Promise<string> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a PNG, JPEG, or WebP signature image.');
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    if (image.naturalWidth > 4096 || image.naturalHeight > 4096) {
      throw new Error('Signature images must be no larger than 4096 pixels per side.');
    }

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('Signature image could not be read.'));
      };
      reader.onerror = () => reject(new Error('Signature image could not be read.'));
      reader.readAsDataURL(file);
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Signature images')) throw error;
    throw new Error('That signature image is unsupported or could not be opened.');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
