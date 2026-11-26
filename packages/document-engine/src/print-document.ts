export async function printDocument(): Promise<void> {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await document.fonts.ready;
  await Promise.all(Array.from(document.images, (image) => image.decode().catch(() => undefined)));
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
  window.print();
}
