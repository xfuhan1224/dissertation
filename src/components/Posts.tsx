import React from "react";
import "./Posts.css";
import Post from "./Post";
import Upload from "./Upload";
import { PostProps } from "./Post";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useNavigate } from "react-router-dom"; // 引入 useNavigate

const Posts = () => {
  console.log("posts");
  const navigate = useNavigate(); // 创建 navigate 实例
 
  // 使用useQuery钩子获取帖子数据
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => makeRequest.get("/posts").then((res) => res.data),
  });

  if (error) {
    console.log(error);
  }

  return (
    <div className="posts">
      <Upload></Upload>
      {error
        ? "Error!"
        : isLoading
        ? "Loading..."
        : data &&
          data.map((post: PostProps) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
