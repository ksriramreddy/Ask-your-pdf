from fastapi import UploadFile , FastAPI, Form
from embeddings import read_file , save_vectors 
from ask_question import ask_question
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
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
    except Exception:
        raise
    

@app.post('/ask')
async def ask_questions(question : str = Form(...)):
    if not question:
        return {
            "error" : "No question provided"
        }
        
    answer = ask_question(question=question)
    
    return answer