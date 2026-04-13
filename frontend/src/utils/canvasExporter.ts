import html2canvas from 'html2canvas';

export const exportAsImage = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }
  
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Double resolution for crisp Instagram Stories
      backgroundColor: '#0f172a', // Tailwind slate-900
      useCORS: true,
      logging: false,
    });

    const image = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = image;
    link.click();
  } catch (err) {
    console.error("Failed to export image", err);
  }
};