import {axiosInstance} from "../axios/axios"


export const askQuestion = async (question : string) =>{
    try {
        const resp = await axiosInstance.post("/ask", {question},{
        headers: { "Content-Type": "multipart/form-data" },
    })
        return resp.data
    } catch (error) {
        return {
            "error" : error
        }
    }
}