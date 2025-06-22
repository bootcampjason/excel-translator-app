export async function translateExcelFile(file, sourceLang, targetLang, onProgress = () => {}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sourceLang', sourceLang);
  formData.append('targetLang', targetLang);

  const response = await fetch(`${process.env.REACT_APP_API_URL}/translate`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Translation failed.');
  }

  return await response.blob();
}
