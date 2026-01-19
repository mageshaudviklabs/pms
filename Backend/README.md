### Steps to reproduce - 

1. create a virtual environment `python -m venv .venv`
2. Go inside the venv/activate the venv - `.venv\Scripts\activate` (Windows) & `source venv/bin/activate` (mac/Linux)
3. install the dependencies - `pip install -r requirements.txt`
4. run the dev environment - `uvicorn app.main:app --reload`