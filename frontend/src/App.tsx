import { use, useEffect, useRef, useState } from 'react'
import './App.css'
import { uploadFile } from './routes/upload_file'
import { askQuestion } from './routes/ask_question'
import toast from 'react-hot-toast'
import { LuLoader } from "react-icons/lu";
import { BsFillSendFill } from 'react-icons/bs'
import { FaArrowUp, FaFilePdf, FaSquare } from 'react-icons/fa'
import { Pdfviewer } from './component/Pdfviewer'


function App() {

  const fileRef = useRef<HTMLInputElement | null>(null)
  const [question, setQuestion] = useState<string>("")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isAnwering, setIsAnswering] = useState<boolean>(false)
  const [file, setfile] = useState<File | null>(null)
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([])
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("")

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        ask_question();
      }
    };

    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!previewFile) return;

    const objectUrl = URL.createObjectURL(previewFile);
    setFileUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [previewFile]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

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

      setPreviewFile(file)
      console.log(chat);
      toast.success("File uploaded successfully ✅")
    })
      .catch(() => {
        setChat(prev => [...prev, {
          sender: "file",
          text: `${fileName} uploaded failed ❌`
        }])
        toast.error("Failed to upload file")
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
        <div className='flex  w-full '>

          {
            previewFile &&
            <div className='hidden lg:block w-[40%] rounded-4xl '>
              <><Pdfviewer fileUrl={fileUrl} /></>
            </div>
          }

          <div className="rounded-2xl mx-auto md:w-[60%]  w-full  bg-black h-[calc(100vh-30px)] p-2" >
            <div className="flex  flex-col space-y-3 overflow-y-auto p-4 h-[80vh] scrollbar">
              <>
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
                {
                  isAnwering &&
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-2xl w-fit">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                }
              </>
              <div ref={chatEndRef}></div>
            </div>
            <div className=''>

              <div className='bg-neutral-800 h-14 rounded-4xl flex items-center justify-between relative'>

                {
                  file &&
                  <div className=' h-24 absolute bottom-[105%] bg-neutral-800 w-fit rounded-4xl  flex items-center justify-between gap-5'>
                    <h1 className='ml-5'>{file.name}</h1>
                    <div className='flex gap-3 items-center'>
                      <button className=' text-4xl cursor-pointer' onClick={() => setfile(null)}>×</button>
                      <button onClick={sendFile} className='text-xl cursor-pointer mr-5 mt-2'>
                        {
                          isUploading ? <><LuLoader className=' animate-spin' /></> :
                            <><BsFillSendFill /></>
                        }
                      </button>

                    </div>
                  </div>
                }

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
                    className={`mr-5  p-2 rounded-full text-2xl cursor-pointer ${question ? "bg-blue-600" : "bg-gray-400  "}`}>
                    {
                      isAnwering ? <><FaSquare className='text-black' /></> : <FaArrowUp className='text-black' />
                    }
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App