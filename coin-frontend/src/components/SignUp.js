// src/components/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';
import './SignUp.css';

function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        style: '안정형' // 기본값
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData);
            alert('회원가입이 완료되었습니다.');
            navigate('/login'); // 로그인 페이지로 이동
        } catch (error) {
            alert(error.message || '회원가입 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                <h2>회원가입</h2>
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="사용자명"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="이메일"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="비밀번호"
                        required
                    />
                </div>
                <div className="form-group">
                    <select 
                        name="style" 
                        value={formData.style}
                        onChange={handleChange}
                        required
                    >
                        <option value="안정형">안정형</option>
                        <option value="공격형">공격형</option>
                    </select>
                </div>
                <button type="submit">가입하기</button>
            </form>
        </div>
    );
}

export default SignUp;