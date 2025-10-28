import os
import faiss
import PyPDF2
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
from fastapi import UploadFile
import numpy as np
import pickle
from fastapi import HTTPException

load_dotenv()

index = faiss.IndexFlatL2(1536)

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")


def read_file(file : UploadFile ):
    print("started reading file")
    type = file.filename.split(".")[-1].lower()
    
    if type != "pdf":
        print("not a pdf")
        raise HTTPException(status_code=400 , detail="Only pdf files are allowes")
    try:
           
        reader = PyPDF2.PdfReader(file.file)
        text = []
        
        for page in reader.pages:
            text.append(page.extract_text())
            
        content = "\n".join(text)
        
        chunks = []
        for i in range(0,len(content),300):
            chunks.append(content[i : i+450])
        print("Done reading file")
        
        return chunks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file {str(e)}")
    
    
    
def save_vectors(chunks):
    print("Started converting to embeddings")
    
    try:
        vectors =  embeddings.embed_documents(chunks)
        # print(vectors)
        
        dim = len(vectors[0])
        index = faiss.IndexFlatL2(dim)
        
        
        index.add(np.array(vectors).astype('float32'))
        print("Converted to embeddings")
        
        os.makedirs("backend" , exist_ok=True)
        # if not os.path.exists("backend/faiss.index"):
        #     return{
        #         "error" : "faiss file does not exists"
        #     }
        
        faiss.write_index(index,"faiss_store/faiss.index")
        print("Saved vector file")
        
        with open("faiss_store/chunks.pkl","wb") as f:
            pickle.dump(chunks, f)
            
            
    except Exception as e:
        raise HTTPException(status_code=500 , detail=f"Error converting Vector files {e}")