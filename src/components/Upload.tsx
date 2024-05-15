import "./Upload.css";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useContext } from "react";
import { makeRequest } from "../axios";
import { AuthContext } from "./authContext";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [desc, setDesc] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { currentUser } = useContext(AuthContext);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return makeRequest.post("/posts", formData);
    },
    onSuccess: () => {
      console.log("Success");
      queryClient.invalidateQueries(["posts"]);
      setDesc("");
      setFile(null);
      setPreviewImage(null);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (file.size > 5242880) {
        alert("File size should not exceed 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed");
        return;
      }
      setFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!desc || !file) {
      console.log("Description or file is missing.");
      return;
    }

    const formData = new FormData();
    formData.append("desc", desc);
    formData.append("img", file);

    mutation.mutate(formData, {
      onError: (error: any) => {
        if (error.response && error.response.status === 403) {
          alert("You're unable to post because your account has been revoked.");
        } else {
          alert("An unexpected error occurred.");
        }
      },
    });
  };

  return (
    <div className="post-block">
      <form className="card" onSubmit={handleSubmit}>
        <div className="topic">
          <a>Create your post here</a>
        </div>
        <div className="input">
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{ maxWidth: "20%", marginBottom: "10px" }}
            />
          )}
          <textarea
            placeholder="What's your post desc?"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
        <div className="submit">
          <label className="submit-content">
            <InsertPhotoIcon />
            <span>Add Picture</span>
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
          <button type="submit" className="btnSubmit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
