import React, { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignValidation'; // 确保路径正确
import axios from 'axios';

interface IErrors {
    name?: string;
    email?: string;
    password?: string;
}

function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState<IErrors>({});
    
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        // 确保使用最新的验证结果来决定是否提交表单
        if (!validationErrors.name && !validationErrors.email && !validationErrors.password) {
            axios.post('http://localhost:8081/backend/auth/register', values)
            .then(res => {
              // 确保这里的逻辑执行了
              console.log('Registration successful', res.data);
              navigate('/login');
            })
            .catch(err => {
              console.error('Registration failed', err);
              // 这里可以设置一个状态来显示错误信息
            });
    };
}

    return (
        <div className='lgn-page'>
            <div className='lgn-frame'>
            <h2>Sign up</h2>
                <form onSubmit={handleSubmit}>
                <div className='name-p'>
                        <label htmlFor="name">First Name</label>
                        <input type="text" placeholder='Enter Your First Name' name='name' onChange={handleInput}/>
                        {errors.name && <span className='text-danger'>{errors.name}</span>}
                    </div>
                    <div className='email-p'>
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder='Enter Email' name='email' onChange={handleInput}/>
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
            <div className='password-p'>
                <label htmlFor="password">Password</label>
                <input type="password" placeholder='Enter Password' name='password' onChange={handleInput}/>
                {errors.password && <span className='text-danger'>{errors.password}</span>}
            </div>
            <button type='submit' className='btn-success'>Sign Up</button>
                </form>
            </div>

        </div>
    );
}

export default Signup;
