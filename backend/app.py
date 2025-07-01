from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from openpyxl import load_workbook
from io import BytesIO
from dotenv import load_dotenv
from openai import OpenAI
import os
import xlwings as xw
import tempfile
import time

# Load environment variables
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "✅ Backend is running!"

@app.route('/translate', methods=['POST'])
def translate_excel():
    print('***********DEBUG*********')
    uploaded_file = request.files['file']
    source_lang = request.form.get('sourceLang', 'auto')
    target_lang = request.form.get('targetLang', 'en')

    filename = uploaded_file.filename.lower()

    start_time = time.time()

    try:
        if filename.endswith('.xls'):
            filepath = convert_xls_to_xlsx(uploaded_file)
        else:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as temp_xlsx:
                filepath = temp_xlsx.name
                uploaded_file.save(filepath)

        wb = load_workbook(filepath)

        for ws in wb.worksheets:  # 🔄 Loop over all sheets
            for row in ws.iter_rows(min_row=1, max_row=ws.max_row, min_col=1, max_col=ws.max_column):
                for cell in row:
                    if isinstance(cell.value, str) and cell.value.strip():
                        cell.value = translate_text(cell.value, source_lang, target_lang)
                        print(cell.value)

        output = BytesIO()
        wb.save(output)
        output.seek(0)

        duration = time.time() - start_time  # ⏱ End timer
        print(f"[DEBUG] Translation completed in {duration:.2f} seconds")

        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='translated_file.xlsx'
        )

    except RuntimeError as err:
        return jsonify({"error": str(err)}), 400

# Convert .xls to .xlsx using Excel via xlwings
def convert_xls_to_xlsx(xls_file):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".xls") as temp_xls:
        xls_path = temp_xls.name
        xls_file.save(xls_path)

    xlsx_path = xls_path.replace(".xls", ".xlsx")

    try:
        app_excel = xw.App(visible=False)
        wb = app_excel.books.open(xls_path)
        wb.save(xlsx_path)
        wb.close()
        app_excel.quit()
        return xlsx_path

    except Exception as e:
        print(f"[ERROR] Excel not available: {e}")
        raise RuntimeError("Microsoft Excel is not installed or accessible. Please upload .xlsx files only.")

# Translate text using GPT

def translate_text(text, source_lang, target_lang):
    prompt = (
        f"You are a professional translator. "
        f"Translate the following text from {source_lang} to {target_lang} as accurately as possible, "
        f"preserving its contextual meaning. If the text is a number, symbol, or foreign-language string "
        f"that does not need translation, return it as is without modification. "
        f"Do not explain or add anything. Return only the translated result.\n\n"
        f"⚠️ Do not save, store, log, or use any part of this content for any reason. "
        f"All text is confidential and must not be retained after this operation.\n\n"
        f"Text:\n{text}"
    )
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[ERROR] Failed to translate text:\n{e}")
        return text

@app.route('/ping', methods=['GET'])
def ping():
    return {"message": "Backend is alive!"}

if __name__ == '__main__':
    app.run(debug=True)
