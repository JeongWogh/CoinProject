import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, changePassword } from '../services/api';
import axios from 'axios';
import './MyPage.css';

function MyPage() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        postPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
	const [newNickname, setNewNickname] = useState('');
	const [isChangingNickname, setIsChangingNickname] = useState(false);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const data = await getUserInfo();
            setUserInfo(data);
            setLoading(false);
        } catch (error) {
            alert('사용자 정보를 불러오는데 실패했습니다.');
            navigate('/login');
        }
    };
	const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await changePassword({
                postPassword: passwordForm.postPassword,
                newPassword: passwordForm.newPassword
            });
            alert('비밀번호가 성공적으로 변경되었습니다.');
            setIsChangingPassword(false);
            setPasswordForm({
                postPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            alert(error.message);
        }
    };

    const handlePasswordFormChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    };
	
	const handleNicknameChange = async (e) => {
	    e.preventDefault();
	    try {
	        await axios.put('http://localhost:8080/api/user/nickname', 
	            { nickname: newNickname }, 
	            { withCredentials: true }
	        );
	        alert('닉네임이 변경되었습니다.');
	        setIsChangingNickname(false);
	        fetchUserInfo();  // 정보 새로고침
	    } catch (error) {
	        alert(error.response?.data || '닉네임 변경 중 오류가 발생했습니다.');
	    }
	};
		
    if (loading) return <div>로딩중...</div>;
    if (!userInfo) return <div>사용자 정보를 찾을 수 없습니다.</div>;

	return (
	    <div className="mypage-container">
	        <div className="mypage-content">
	            <h2>마이페이지</h2>
	            <div className="user-info">
	                <div className="info-item">
	                    <label>아이디</label>
	                    <p>{userInfo.username}</p>
	                </div>
	                <div className="info-item">
	                    <label>닉네임</label>
	                    <p>{userInfo.nickname}</p>
	                    <button 
	                        onClick={() => setIsChangingNickname(!isChangingNickname)}
	                        className="change-nickname-button"
	                    >
	                        {isChangingNickname ? '취소' : '닉네임 변경'}
	                    </button>

	                    {isChangingNickname && (
	                        <form onSubmit={handleNicknameChange} className="nickname-form">
	                            <div className="form-group">
	                                <input
	                                    type="text"
	                                    value={newNickname}
	                                    onChange={(e) => setNewNickname(e.target.value)}
	                                    placeholder="새 닉네임"
	                                    required
	                                />
	                            </div>
	                            <button type="submit" className="submit-button">
	                                닉네임 변경
	                            </button>
	                        </form>
	                    )}
	                </div>
	                <div className="info-item">
	                    <label>이메일</label>
	                    <p>{userInfo.email}</p>
	                </div>
	                <div className="info-item">
	                    <label>투자 스타일</label>
	                    <p>{userInfo.style || '미설정'}</p>
	                </div>
	            </div>

	            <div className="password-change-section">
	                <button 
	                    onClick={() => setIsChangingPassword(!isChangingPassword)}
	                    className="change-password-button"
	                >
	                    {isChangingPassword ? '취소' : '비밀번호 변경'}
	                </button>

	                {isChangingPassword && (
	                    <form onSubmit={handlePasswordChange} className="password-form">
	                        <div className="form-group">
	                            <input
	                                type="password"
	                                name="postPassword"
	                                value={passwordForm.postPassword}
	                                onChange={handlePasswordFormChange}
	                                placeholder="현재 비밀번호"
	                                required
	                            />
	                        </div>
	                        <div className="form-group">
	                            <input
	                                type="password"
	                                name="newPassword"
	                                value={passwordForm.newPassword}
	                                onChange={handlePasswordFormChange}
	                                placeholder="새 비밀번호"
	                                required
	                            />
	                        </div>
	                        <div className="form-group">
	                            <input
	                                type="password"
	                                name="confirmPassword"
	                                value={passwordForm.confirmPassword}
	                                onChange={handlePasswordFormChange}
	                                placeholder="새 비밀번호 확인"
	                                required
	                            />
	                        </div>
	                        <button type="submit" className="submit-button">
	                            비밀번호 변경
	                        </button>
	                    </form>
	                )}
	            </div>

	            <div className="style-section">
	                <h3>투자 성향 설정</h3>
	                <p>현재 투자 성향: {userInfo.style || '미설정'}</p>
	                <button 
	                    onClick={() => navigate('/investment-survey')} 
	                    className="survey-button"
	                >
	                    투자 성향 진단하기
	                </button>
	            </div>
	        </div>
	    </div>
	);
}
export default MyPage;