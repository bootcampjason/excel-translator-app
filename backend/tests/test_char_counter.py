from utils.char_counter import estimate_chars_in_file
from werkzeug.datastructures import FileStorage # Simulating Flask's FileStorage for testing
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# test function
def test_estimate_chars_in_file():
    with open("tests/test_kr.xlsx", "rb") as f:  # Use any test Excel file
        file_storage = FileStorage(f, filename="sample.xlsx")
        count = estimate_chars_in_file(file_storage)
        print(f"Estimated character count: {count}")

if __name__ == "__main__":
    test_estimate_chars_in_file()
