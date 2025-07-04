export async function translateExcelFile(file, sourceLang, targetLang, onProgress = () => { }) {
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

  const translatedBlob = await response.blob();
  // Needed for returning the correct file name
  const disposition = response.headers.get('Content-Disposition');

  let filename = 'translated_file.xlsx';
  if (disposition) {
    const utf8Match = disposition.match(/filename\*\=UTF-8''([^;]+)/i);
    const asciiMatch = disposition.match(/filename="?([^"]+)"?/);
    if (utf8Match) {
      filename = decodeURIComponent(utf8Match[1]);
    } else if (asciiMatch) {
      filename = asciiMatch[1];
    }
  }
  return { translatedBlob, filename };
}
