from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from openpyxl import load_workbook
from io import BytesIO
from dotenv import load_dotenv
from openai import OpenAI
import os
import xlwings as xw
import tempfile

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

    try:
        if filename.endswith('.xls'):
            filepath = convert_xls_to_xlsx(uploaded_file)
        else:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as temp_xlsx:
                filepath = temp_xlsx.name
                uploaded_file.save(filepath)
        
        wb = load_workbook(filepath)
        ws = wb.active

        print('ws', ws)

        for ws in wb.worksheets:  # 🔄 Loop over all sheets
            for row in ws.iter_rows(min_row=1, max_row=ws.max_row, min_col=1, max_col=ws.max_column):
                for cell in row:
                    if isinstance(cell.value, str) and cell.value.strip():
                        cell.value = translate_text(cell.value, source_lang, target_lang)
                        print('cell.value', cell.value)


        output = BytesIO()
        wb.save(output)
        output.seek(0)

        print('output', output)

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
    prompt = f"Translate the {text} from {source_lang} to {target_lang}. If the text could have multitple definitions, use previous text's context to come up with the translation. Only return the successfully tranlsated result. Do not provide explanation!"
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
