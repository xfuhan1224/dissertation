import "./Post.css";
import React, { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import Comments from "./Comments";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "./authContext";

export interface PostProps {
  id: number;
  name: string;
  userId: number;
  desc: string;
  img: string;
  createdAt: string;
  likes: number;
}

interface Like {
  id: number;
  userId: number;
  postId: number;
}

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const timeSincePosted = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () =>
      makeRequest.get("/likes?postId=" + post.id).then((res) => res.data),
  });

  const mutation = useMutation(
    (variables: { action: "add" | "delete"; postId: number }) => {
      if (variables.action === "delete") {
        console.log("disliked");
        return makeRequest.delete(`/likes`, {
          data: { postId: variables.postId },
        });
      } else {
        return makeRequest.post(`/likes`, { postId: variables.postId });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likes", post.id]);
      },
      onError: (error: any) => {
        if (error.response && error.response.status === 403) {
          alert(
            "You're unable to perform because your account has been revoked."
          );
        } else {
          alert("An error occurred while trying to post the comment.");
        }
      },
    }
  );

  const deleteMutation = useMutation(
    (postId: number) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
      onError: (error: any) => {
        // 错误处理逻辑，例如显示一个消息
        if (error.response && error.response.status === 403) {
          alert(
            "You're unable to delete because your account has been revoked."
          );
        } else {
          alert("An error occurred while trying to post the comment.");
        }
      },
    }
  );

  const toggleLike = () => {
    if (currentUser) {
      if (isLoading) return;

      const isLiked = data ? data.includes(currentUser.id) : false;
      const action = isLiked ? "delete" : "add";
      mutation.mutate({ action, postId: post.id });
    } else {
      console.error("No current user found");
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  //Temporary
  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <div className="details">
              <span className="name">{post.name}</span>
              <span className="date">{timeSincePosted}</span>
            </div>
          </div>
          <DeleteIcon onClick={handleDelete} />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={`http://localhost:8081/${post.img}`} alt="Post" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                {currentUser && data && data.includes(currentUser.id) ? (
                  <FavoriteOutlinedIcon
                    style={{ color: "red" }}
                    onClick={toggleLike}
                  />
                ) : (
                  <FavoriteBorderOutlinedIcon onClick={toggleLike} />
                )}
                <span>{data?.length || 0} Likes</span>
              </>
            )}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
