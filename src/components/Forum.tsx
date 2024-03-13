import './Forum.css'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Forum = () => {
    

    return(
        <div className='forum-page'>
            <img className='img1'src="/4380747.jpg" alt="Forum" />
            <div className='intro-1'>
                Building Your Communities
            </div>
            <div className='intro-2'>
                <p>NFTinusite serves as a dedicated platform for NFT traders to share and introduce their NFTs to the community. It offers an opportunity for enthusiasts and collectors to engage in discussions about the trading value of NFTs, explore new trends, and gain insights into the NFT market. Whether you're looking to showcase your latest NFT creation or seeking advice on your next acquisition, this forum is the ideal place for all things NFT. Join the conversation and connect with like-minded individuals who share your passion for the dynamic world of NFT trading.</p>
            </div>
            <li><Link to="/posts"><button className='forum-start'>Get Started</button></Link></li>
        </div>
    )
}

export default Forum;