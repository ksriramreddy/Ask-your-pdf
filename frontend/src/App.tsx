import { useRef, useState } from 'react'
import './App.css'
import { uploadFile } from './routes/upload_file'
import { askQuestion } from './routes/ask_question'
import toast from 'react-hot-toast'
import { LuLoader } from "react-icons/lu";
import { BsFillSendFill } from 'react-icons/bs'
import { FaArrowUp, FaFilePdf, FaSquare } from 'react-icons/fa'

function App() {

  const fileRef = useRef<HTMLInputElement | null>(null)
  const [question, setQuestion] = useState<string>("")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isAnwering, setIsAnswering] = useState<boolean>(false)
  const [file, setfile] = useState<File | null>(null)
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([])
  const [fileName, setFileName] = useState<string>("")

  const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    const file = e.target.files?.[0]
    if (!file) {
      toast.error("No file selected")
      return
    }
    setfile(file)
    setFileName(file.name)
    console.log(file)
  }

  const cilckFile = () => {
    fileRef.current?.click()
  }




  const sendFile = async () => {
    if (!file) {
      alert("No file selected")
      return
    }
    if (isUploading) {
      return
    }
    setIsUploading(true)
    const resp = uploadFile(file)

    resp.then(() => {
      setFileName(file.name)
      setChat(prev => [...prev, {
        sender: "file",
        text: `${fileName} uploaded successfully`
      }])
      console.log(chat);
      toast.success("File uploaded successfully")
    })
      .finally(() => {
        setIsUploading(false)
        setfile(null)
      })
  }

  const ask_question = () => {
    if (!question) {
      toast.error("No question provides")
      return
    }
    if (isAnwering) {
      return
    }
    if (!fileName) {
      toast.error("No file provided to answer")
      return
    }

    setIsAnswering(true)
    setChat(prev => [...prev, {
      sender: "user",
      text: question
    }])
    setQuestion("")

    const resp = askQuestion(question)
    resp.then((resp) => {
      console.log(resp);

      setChat(prev => [...prev, {
        sender: "bot",
        text: resp.answer
      }])
    })
      .finally(() => {
        console.log(chat);
        
        setIsAnswering(false)
      })
  }

  return (
    <>
      <div className='text-white bg-neutral-800 h-screen w-screen flex justify-center items-center '>
        <div className="md:w-[60%] rounded-2xl sm:w-full bg- bg-black h-[calc(100vh-30px)] p-2" >
          <div className="flex flex-col space-y-3 overflow-y-auto p-4 h-[80vh]">
            {
              chat.map((msg, i) => {
                if (msg.sender === 'bot') {
                  return (
                    <div key={i} className='flex justify-start'>
                      <div className='bg-gray-800 text-white px-4 py-2 rounded-2xl max-w-[70%] shadow-md'>
                        {msg.text}
                      </div>
                    </div>
                  );
                } else if (msg.sender === 'user') {
                  return (
                    <div key={i} className='flex justify-end'>
                      <div className='bg-blue-600 text-white px-4 py-2 rounded-2xl max-w-[70%] shadow-md'>
                        {msg.text}
                      </div>
                    </div>
                  );
                } else if (msg.sender === "file") {
                  return (
                    <div key={i} className="flex justify-center">
                      <div className="bg-gray-900 text-gray-200 border border-gray-800 px-6 py-3 rounded-xl shadow-md flex items-center gap-2">
                        <span className="text-xl">📄</span>
                        <span className="font-medium">{msg.text}</span>
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })
            }
          </div>
          <div className=''>
            
            <div className='bg-neutral-800 h-14 rounded-4xl flex items-center justify-between'>
              <input className='ml-5 w-full outline-none' placeholder='Ask you pdf...'
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <div className='flex gap-3 items-center'>
                <input
                  ref={fileRef}
                  className='hidden'
                  type="file"
                  // accept="application/pdf"
                  onChange={(e) => { selectFile(e) }}
                />
                <button onClick={cilckFile} className='text-2xl cursor-pointer'><FaFilePdf /></button>
                <button
                  onClick={ask_question}
                  disabled={isAnwering && isUploading}
                  className='mr-5 bg-white p-2 rounded-full text-2xl cursor-pointer'>
                  {
                    isAnwering ? <><FaSquare className='text-black' /></> : <FaArrowUp className='text-black' />
                  }
                </button>
              </div>
            </div>
            {
              file &&
              <div className=' h-13  rounded-4xl  flex items-center w-full justify-between'>
                <h1 className='ml-5'>{file.name}</h1>
                <div className='flex gap-3 items-center'>
                  <button className=' text-4xl cursor-pointer' onClick={() => setfile(null)}>×</button>
                  <button onClick={sendFile} className='text-xl cursor-pointer mr-5 mt-2'>
                    {
                      isUploading? <><LuLoader className=' animate-spin' /></> :
                      <><BsFillSendFill /></>
                    }
                  </button>
                  
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default App