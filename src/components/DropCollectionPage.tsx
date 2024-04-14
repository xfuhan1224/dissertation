import "./DropCollectionPage.css";
import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import MenuBookSharpIcon from "@mui/icons-material/MenuBookSharp";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import VisibilityOffSharpIcon from "@mui/icons-material/VisibilityOffSharp";
import AddPhotoAlternateSharpIcon from "@mui/icons-material/AddPhotoAlternateSharp";

const DropCollectionPage = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // 使用React Query的useMutation钩子管理上传逻辑
  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return makeRequest.post("/drops", formData);
    },
    onSuccess: () => {
      console.log("Success");
      queryClient.invalidateQueries(["drops"]);
      setName("");
      setPrice("");
      setImage(null);
      setPreviewUrl(null);
    },
    onError: (error: any) => {
      console.error("Upload failed:", error);
      if (error.response && error.response.status === 403) {
        alert(
          "You're unable to drop because your account has been revoked."
        );
      } else {
        alert("An error occurred while trying to post the comment.");
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(""); // 清理预览URL状态
      }
    };
  }, [previewUrl]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !image) {
      console.log("Description or file is missing.");
      return;
    }

    const formData = new FormData();
    formData.append("desc", name);
    formData.append("img", image);
    formData.append("price", price);

    mutation.mutate(formData);
  };

  return (
    <div className="drop-page">
      <form className="drop-card" onSubmit={handleSubmit}>
        <div className="logo-drop">
          <div className="logo-top">Logo Image</div>
          <input
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="image-upload"
          />
          <div className="preview-container">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: "40%", maxHeight: "100px" }}
              />
            )}
          </div>
          <label htmlFor="image-upload" className="logo-upload">
            <div className="logo-left">
              <AddPhotoAlternateSharpIcon
                style={{ fontSize: "58px", marginLeft: "1.5rem" }}
              />
            </div>
            <div className="logo-right">Click to upload</div>
          </label>
        </div>
        <div className="name-drop">
          <div className="name-top">Collection Name</div>
          <input
            placeholder="What's the collection name?"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="price-drop">
          <div className="price-top">Price</div>
          <input
            placeholder="Ethereum"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          ></input>
        </div>
        <button type="submit" className="deploy-btn">
          Deploy
        </button>
      </form>
      <div className="instruction-part">
        <div className="instruction-card">
          <h1>After deploying you'll be able to: </h1>
          <div className="able-to-do">
            <h1>
              <MenuBookSharpIcon
                style={{
                  fontSize: "1.5rem",
                  marginRight: "7px",
                  marginBottom: "2px",
                }}
              />
              Manage collection settings
            </h1>
            <p>Add new collection, delete collection you don't want.</p>
            <h1>
              <SettingsSharpIcon
                style={{
                  fontSize: "1.5rem",
                  marginRight: "7px",
                  marginBottom: "2px",
                }}
              />
              Set up your drop
            </h1>
            <p>Set up your mint state, edit the price.</p>
          </div>
          <div className="community-able-to">
            <h1>Your community: </h1>
            <h1 style={{ color: "#5e5e5e", fontSize: "1rem" }}>
              <VisibilityOffSharpIcon
                style={{
                  fontSize: "1.5rem",
                  marginRight: "7px",
                  marginBottom: "2px",
                }}
              />
              Can't view
            </h1>
            <p>Your items until you publish them.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropCollectionPage;
