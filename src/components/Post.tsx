import './Post.css'
import React, { useState } from 'react';
import Comments from './Comments';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export interface PostProps {
    id: number;
    name: string;
    userId: number;
    desc: string;
  }
  
const Post: React.FC<{post: PostProps}> = ({ post }) => {
 const [commentOpen, setCommentOpen] = useState(false);

    //Temporary
    const liked = false;
      return (
          <div className='post'>
            <div className="container">
              <div className="user">
                  <div className="userInfo">
                  <div className="details"> 
                      <span className='name'>{post.name}</span>
                      <span className='date'>1 min ago</span>
                  </div>
                  </div>
                  <MoreHorizIcon />
              </div>
              <div className="content">
                <p>{post.desc}</p>
              </div>
              <div className="info">
                <div className="item">
                    {liked ? <FavoriteOutlinedIcon/> : <FavoriteBorderOutlinedIcon />}
                    12 Likes
                </div>
                <div className='item' onClick={()=>setCommentOpen(!commentOpen)}>
                    <TextsmsOutlinedIcon />
                    10 Comments
                </div>
              </div>
              {commentOpen && <Comments />}
              </div>
          </div>
      )
  }
  
  export default Post;
  