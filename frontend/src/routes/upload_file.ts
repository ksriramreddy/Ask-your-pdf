import { PiTextIndent } from "react-icons/pi";
import {axiosInstance} from "../axios/axios"


export const uploadFile = async (file : File) =>{
    const form = new FormData()

    form.append("file" , file);

    try {
        const resp = await axiosInstance.post("/uploadfile",form , {
            headers : {
                "Content-Type" : "multipart/form-data"
            }
        })

        return resp.data
    } catch (error) {
        console.log("failed to upload");
        
        throw new Error(error.message)
    }
}