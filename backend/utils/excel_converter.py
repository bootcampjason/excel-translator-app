import tempfile
import xlwings as xw

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
        raise RuntimeError(
            "Microsoft Excel is not installed or accessible. Please upload .xlsx files only."
        )
