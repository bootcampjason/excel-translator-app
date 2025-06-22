from flask import Flask, request, send_file
from flask_cors import CORS
from openpyxl import load_workbook
from io import BytesIO
from dotenv import load_dotenv
from openai import OpenAI
import os
import xlwings as xw
import tempfile
import os

# Load environment variables
load_dotenv()

# Initialize OpenAI client with API key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Flask app setup
app = Flask(__name__)
CORS(app)

def convert_xls_to_xlsx(xls_file):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.xls') as temp_xls:
        xls_path = temp_xls.name
        xls_file.save(xls_path)  # Save uploaded file to disk

    xlsx_path = xls_path.replace('.xls', '.xlsx')

    # Launch Excel and convert using xlwings
    app = xw.App(visible=False)
    try:
        wb = app.books.open(xls_path)
        wb.save(xlsx_path)
        wb.close()
    finally:
        app.quit()

    return xlsx_path

# Function to translate text using GPT (OpenAI Python SDK v1+)
def translate_text(text, source_lang, target_lang):
    prompt = f"Translate this from {source_lang} to {target_lang}:\n\n{text}"

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[ERROR] Failed to translate text:\n{e}")
        return text  # Fallback to original if translation fails

# POST /translate endpoint
@app.route('/translate', methods=['POST'])
def translate_excel():
    file = request.files['file']
    source_lang = request.form.get('sourceLang', 'auto')
    target_lang = request.form.get('targetLang', 'en')

    # Load the uploaded Excel file
    wb = load_workbook(filename=file)
    ws = wb.active  # For now, just handle the first sheet

    # Translate all string cells
    for row in ws.iter_rows(min_row=1, max_row=ws.max_row, min_col=1, max_col=ws.max_column):
        for cell in row:
            if isinstance(cell.value, str) and cell.value.strip():
                translated = translate_text(cell.value, source_lang, target_lang)
                cell.value = translated

    # Save modified workbook to memory
    output = BytesIO()
    wb.save(output)
    output.seek(0)

    return send_file(
        output,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name='translated_file.xlsx'
    )

# Optional test route
@app.route('/ping', methods=['GET'])
def ping():
    return {"message": "Backend is alive!"}

# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)
