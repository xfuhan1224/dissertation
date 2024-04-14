import React, { useState } from "react";
import "./Comments.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import moment from "moment";

interface Comment {
  id: number;
  name: string;
  desc: string;
  createdAt: string;
}

interface CommentsProps {
  postId: number;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () =>
      makeRequest.get(`/comments?postId=${postId}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (newComment: { desc: string; postId: number }) => {
      return makeRequest.post(
        "/comments",
        { ...newComment, postId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
    },
    onError: (error: any) => {
      // 错误处理逻辑，例如显示一个消息
      if (error.response && error.response.status === 403) {
        alert(
          "You're unable to comment because your account has been revoked."
        );
      } else {
        alert("An error occurred while trying to post the comment.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  if (error) return <div>Error loading comments...</div>;
  if (isLoading) return <div>Loading comments...</div>;

  return (
    <div className="comments">
      <form className="write" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write Your Comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button type="submit" className="btnSend">
          Send
        </button>
      </form>
      {data?.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="itemInfo">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
