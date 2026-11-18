'use client';

import { useEffect, useState } from 'react';

export function useSignatureImage(driverName: string, uploadedSignature: string): string {
  const [generatedSignature, setGeneratedSignature] = useState('');

  useEffect(() => {
    let active = true;
    const name = driverName.trim();

    if (!name) {
      setGeneratedSignature('');
      return () => {
        active = false;
      };
    }

    const generate = async () => {
      await document.fonts.ready;
      const fontFamily =
        getComputedStyle(document.documentElement).getPropertyValue('--font-signature').trim() ||
        'cursive';
      let fontSize = 42;
      const text = `${name.charAt(0).toLocaleUpperCase()}${name.slice(1)}`;
      const measureCanvas = document.createElement('canvas');
      const measureContext = measureCanvas.getContext('2d');
      if (!measureContext) return;

      do {
        measureContext.font = `${fontSize}px ${fontFamily}`;
        if (measureContext.measureText(text).width <= 650 || fontSize <= 24) break;
        fontSize -= 1;
      } while (fontSize > 24);

      await document.fonts.load(`${fontSize}px ${fontFamily}`);
      const textWidth = measureContext.measureText(text).width;
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(Math.max(180, Math.min(690, textWidth + 36)));
      canvas.height = 76;
      const context = canvas.getContext('2d');
      if (!context) return;

      context.font = `${fontSize}px ${fontFamily}`;
      context.fillStyle = '#26352d';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.translate(canvas.width / 2, 35);
      context.rotate(-0.035);
      context.fillText(text, 0, 0, canvas.width - 24);
      context.beginPath();
      context.moveTo(-textWidth / 2, 17);
      context.lineTo(textWidth / 2, 17);
      context.lineWidth = 1.5;
      context.strokeStyle = '#26352d';
      context.stroke();

      if (active) setGeneratedSignature(canvas.toDataURL('image/png'));
    };

    void generate();
    return () => {
      active = false;
    };
  }, [driverName]);

  return uploadedSignature || generatedSignature;
}
