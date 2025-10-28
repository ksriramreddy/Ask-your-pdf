import numpy as np
import faiss
from langchain_openai import OpenAIEmbeddings , ChatOpenAI
from dotenv import load_dotenv
import os
import pickle
load_dotenv()

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

chat = ChatOpenAI(model="gpt-4o-mini")



def ask_question(question : str):
    
    with open("faiss_store/chunks.pkl", "rb") as f:
        chunks = pickle.load(file=f)
    
    index = faiss.read_index("faiss_store/faiss.index")
    
    question_vector = embeddings.embed_query(question)
    question_vector = np.array([question_vector]).astype('float32')
    
    dist , indices = index.search(question_vector , 4)
    
    top_ans = [chunks[i] for i in indices[0] if i < len(chunks)]
    
    answer = "\n".join(top_ans)
    print("context", answer)
    prompt = f"""
    You are a PDF Q/A assistant. Answer this question with given context \n
    question : {question} \n
    context : {answer}
    """
    resp = chat.invoke(prompt)
    
    return {
        "answer" : resp.content
    }
    

# print(ask_question("what are the project i have done"))