'use client';

import { generateNameSignature } from '@driver/lib/driver-salary-slip/generate-name-signature';
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

    void generateNameSignature(name).then(
      (image) => {
        if (active) setGeneratedSignature(image);
      },
      () => {
        if (active) setGeneratedSignature('');
      },
    );
    return () => {
      active = false;
    };
  }, [driverName]);

  return uploadedSignature || generatedSignature;
}
