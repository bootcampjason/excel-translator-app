import * as XLSX from 'xlsx';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('Missing REACT_APP_OPENAI_API_KEY in .env file');
}

async function translateBatchChunked(texts, sourceLang, targetLang, chunkSize = 30, onProgress = () => {}) {
  const chunks = [];
  for (let i = 0; i < texts.length; i += chunkSize) {
    chunks.push(texts.slice(i, i + chunkSize));
  }

  const allTranslations = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    onProgress(i + 1, chunks.length);

    const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Keep the same order. Return only the translated lines, one per line:\n\n${chunk.join('\n')}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || '';
    const lines = result.split('\n').map(line => line.trim());

    allTranslations.push(...lines);
  }

  return allTranslations;
}

export async function translateExcelFile(file, sourceLang, targetLang, onProgress = () => {}) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellStyles: true });

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];

    const flatText = [];
    const cellMap = [];

    for (const cellAddr in sheet) {
      if (!cellAddr.startsWith('!')) {
        const cell = sheet[cellAddr];
        const value = String(cell.v ?? '').trim();
        if (value) {
          flatText.push(value);
          cellMap.push(cellAddr);
        }
      }
    }

    const translated = await translateBatchChunked(flatText, sourceLang, targetLang, 30, onProgress);

    translated.forEach((text, i) => {
      const addr = cellMap[i];
      const cell = sheet[addr];
      if (cell) {
        cell.v = text;
        cell.w = text;

        // Safely update type
        cell.t = 's'; // Ensure it's treated as a string
      }
    });
  }

  const xlsxArray = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
    cellStyles: true,
  });

  return new Blob([xlsxArray], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}