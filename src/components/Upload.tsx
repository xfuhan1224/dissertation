import './Upload.css'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { makeRequest } from "../axios";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

//   const submit = async () => {
//     try{
//         const formData = new FormData();
//         formData.append("file", file);
//         const res = await makeRequest.post('/submit', formData);
//         return res.data;    
//     } catch (err){
//     console.log(err);
//     }
//   }

  const queryClient = useQueryClient();
//   const mutation= useMutation(
//     (newPost) => {
//         return makeRequest.post('/posts', newPost)
//     },
//     {
//         onSuccess: () => {
//             queryClient.invalidateQueries(['posts']);
//         }
//     }
//   )


//   const handleClick = (e) => {
//     e.preventDefault();
//   }

return (
         <div className='post-block'>
                <div className='card'>
                    <div className='topic'>
                        <a>Create your post here</a>
                    </div>
                    <div className='input'>
                        <textarea placeholder="What's your post desc?" name="input">
                        </textarea>
                    </div>
                    <div className='submit'>
                        <div className='submit-content'>
                     <InsertPhotoIcon></InsertPhotoIcon>
                     <span>Add Picture</span>
                     </div>
                     <button className='btnSubmit'>
                        <a>Submit</a>
                        </button>
                    </div>
                </div>
            </div>
)
}

export default Upload;