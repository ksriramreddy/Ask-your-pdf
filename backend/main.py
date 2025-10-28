from fastapi import UploadFile , FastAPI, Form
from embeddings import read_file , save_vectors 
from ask_question import ask_question
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React app URL
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods (POST, GET, etc.)
    allow_headers=["*"],  # allow all headers
)

@app.post("/uploadfile")
async def upload_file(file : UploadFile):
    
    if not file:
        return {
            "error" : "No file provided"
        }
    try:
        
        chunks = read_file(file=file)
        
        save_vectors(chunks)
        
        return {
            "success" : "Pdf uploaded successfully"
        }
    except Exception as e:
        return {
            "error" : str(e)
        }
    

@app.post('/ask')
async def ask_questions(question : str = Form(...)):
    if not question:
        return {
            "error" : "No question provided"
        }
        
    answer = ask_question(question=question)
    
    return answer