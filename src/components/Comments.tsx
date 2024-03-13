import React from 'react';
import './Comments.css';

const Comments = () => {

    //Tempory

    const comments = [
        {
            id: 1,
            desc: "111111111111111111111111111",
            name: 'Andrew',
            userId: 1,
        },

        {
            id: 2,
            desc: "22222222222222222222222222222",
            name: 'James',
            userId: 2,
        },
    ];

    return (
        <div className="comments">
            <div className="write">
                <input type='text' placeholder='Write Your Comment' />
                <button className='btnSend'>Send</button>
            </div>
            {comments.map(comment=>(
                <div className="comment">
                    <div className="itemInfo">
                        <span>{comment.name}</span>
                        <p>{comment.desc}</p>
                    </div>
                    <span className='date'>
                        <a>1 hour ago</a>
                        </span>
                </div>
            ))
            }</div>
    )
}


export default Comments;