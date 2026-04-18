import JSZip from 'jszip';
import { toBlob } from 'html-to-image';

export const generateBlob = async (elementId: string, format: 'story' | 'post'): Promise<Blob | null> => {
  const el = document.getElementById(elementId);
  if (!el) return null;
  
  try {
    return await toBlob(el, {
      pixelRatio: 2.4,
      backgroundColor: '#020617',
      width: 450,
      height: format === 'post' ? 562 : 800,
      skipFonts: true, // Ignores Tailwind's phantom border rendering
    });
  } catch (error) {
    console.error(`Failed to generate blob for ${elementId}:`, error);
    return null;
  }
};

export const triggerDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const shareOrDownloadImage = async (blob: Blob, name: string, format: 'story' | 'post') => {
  const filename = `LogbookWrapped_${format === 'story' ? 'Story' : 'Post'}_${name.replace(/\s+/g, '')}.png`;
  const file = new File([blob], filename, { type: 'image/png' });
  
  try {
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `My LogbookWrapped - ${name}`,
        files: [file]
      });
    } else {
      triggerDownload(blob, filename);
    }
  } catch (err) {
    console.warn("Share cancelled or failed", err);
  }
};

export const downloadZipBundle = async (
  pages: any[],
  readyBlobs: Record<string, Blob>,
  setLoadingText: (text: string) => void
) => {
  const zip = new JSZip();
  const storyFolder = zip.folder("Stories (9x16)");
  const postFolder = zip.folder("Posts (4x5)");

  for (let i = 0; i < pages.length; i++) {
    if (pages[i].isPoster) continue;
    setLoadingText(`Packaging ${pages[i].name}...`);
    
    const storyBlob = readyBlobs[`${pages[i].id}-story`] || await generateBlob(`${pages[i].id}-story`, 'story');
    if (storyBlob && storyFolder) {
      storyFolder.file(`Story_${pages[i].name.replace(/\s+/g, '')}.png`, storyBlob);
    }

    const postBlob = readyBlobs[`${pages[i].id}-post`] || await generateBlob(`${pages[i].id}-post`, 'post');
    if (postBlob && postFolder) {
      postFolder.file(`Post_${pages[i].name.replace(/\s+/g, '')}.png`, postBlob);
    }
  }
  
  setLoadingText('Compressing ZIP bundle...');
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(zipBlob, 'LogbookWrapped_Export.zip');
};