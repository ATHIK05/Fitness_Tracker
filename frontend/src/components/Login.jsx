import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://fitness-tracker-sfug.vercel.app';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [focus, setFocus] = useState({ email: false, password: false });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const emailRef = useRef(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        emailRef.current?.focus();
        return () => { isMounted.current = false; };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await axios.post(`${API_BASE_URL}/api/users/login`, { email, password });
            if (isMounted.current) {
                setMessage('✅ Login successful!');
                onLogin(res.data.user);
            }
        } catch (err) {
            if (isMounted.current) {
                if (err.response && err.response.status === 404) {
                    setMessage('User not found. Please sign up.');
                } else {
                    setMessage(err.response?.data?.message || '❌ Login failed');
                }
            }
        }
        if (isMounted.current) setLoading(false);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f3f4f6',
            padding: 20
        }}>
            <div style={{
                background: '#fff',
                padding: 32,
                borderRadius: 16,
                width: '100%',
                maxWidth: 420,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                fontFamily: 'Arial, sans-serif'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#111827' }}>Welcome Back</h2>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onFocus={() => setFocus({ ...focus, email: true })}
                        onBlur={() => setFocus({ ...focus, email: false })}
                        style={{
                            padding: 14,
                            borderRadius: 10,
                            border: focus.email ? '2px solid #3b82f6' : '1px solid #d1d5db',
                            fontSize: 15,
                            transition: 'border 0.2s'
                        }}
                        required
                    />

                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onFocus={() => setFocus({ ...focus, password: true })}
                            onBlur={() => setFocus({ ...focus, password: false })}
                            style={{
                                padding: 12,
                                borderRadius: 10,
                                border: focus.password ? '2px solid #3b82f6' : '1px solid #d1d5db',
                                fontSize: 15,
                                width: '80%',
                                transition: 'border 0.2s'
                            }}
                            required
                        />
                        <span
                            onClick={() => setShowPassword(prev => !prev)}
                            style={{
                                position: 'absolute',
                                right: 16,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                color: '#6b7280',
                                fontSize: 18
                            }}
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: '#3b82f6',
                            color: '#fff',
                            padding: 14,
                            border: 'none',
                            borderRadius: 10,
                            fontSize: 16,
                            fontWeight: 500,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: '0.3s'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {message && (
                    <div style={{
                        marginTop: 24,
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: message.includes('success') ? '#d1fae5' : '#fee2e2',
                        color: message.includes('success') ? '#065f46' : '#991b1b',
                        fontWeight: 500,
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}

                <div style={{
                    textAlign: 'center',
                    fontSize: 14,
                    marginTop: 24,
                    color: '#6b7280'
                }}>
                    Don't have an account?{' '}
                    <a
                        href="/signup"
                        style={{
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontWeight: 500
                        }}
                    >
                        Sign up
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
