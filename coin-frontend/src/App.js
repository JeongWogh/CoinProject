import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';  // useState, useEffect 추가
import axios from 'axios';  // axios 추가
import SignUp from './components/SignUp';
import Login from './components/Login';
import MyPage from './components/MyPage';
import InvestmentSurvey from './components/InvestmentSurvey';
import SessionTimer from './components/SessionTimer';  // 새로 추가할 컴포넌트
import MarketIndex from './components/MarketIndex';
import './App.css';

function App() {
    const [user, setUser] = React.useState(null);

    // 로그인 상태 확인 함수
    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/user/info', { 
                withCredentials: true 
            });
            setUser(response.data);
        } catch (error) {
            setUser(null);
        }
    };

    // 컴포넌트 마운트 시 로그인 상태 확인
    useEffect(() => {
        checkLoginStatus();
    }, []);

    // 로그아웃 핸들러
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/api/logout', {}, { 
                withCredentials: true 
            });
            setUser(null);
            window.location.href = '/';
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    return (
        <Router>
            <div className="app">
                <nav className="nav-bar">
                    <Link to="/" className="nav-logo">
                        가상화폐 모의투자
                    </Link>
                    <div className="nav-menu">
                        <Link to="/" className="menu-item">거래소</Link>
                        <Link to="/" className="menu-item">입출금</Link>
                        <Link to="/" className="menu-item">투자내역</Link>
                        <Link to="/" className="menu-item">코인동향</Link>
                        <Link to="/" className="menu-item">투자관리</Link>
                        <Link to="/" className="menu-item">고객센터</Link>
						<Link to="/" className="menu-item">커뮤니티</Link>
                    </div>
					<div className="nav-links">
					    {user ? (
					        <>
					            <div className="user-info">
					                <span className="user-name">{user.username}님</span>
					                <SessionTimer />
					            </div>
					            <Link to="/mypage" className="nav-link">마이페이지</Link>
					            <button onClick={handleLogout} className="logout-btn">
					                로그아웃
					            </button>
					        </>
					    ) : (
					        <>
					            <Link to="/signup" className="nav-link">회원가입</Link>
					            <Link to="/login" className="nav-link">로그인</Link>
					        </>
					    )}
					</div>
                </nav>

                <Routes>
                    <Route path="/" element={<main />} />
					<Route paht="/main" element={<MarketIndex />}/> 
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/investment-survey" element={<InvestmentSurvey />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;