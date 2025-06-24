import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await axios.post('/api/users/request-otp', { email, password });
            setStep(2);
            setMessage('✅ OTP sent to your email.');
        } catch (err) {
            setMessage(err.response?.data?.message || '❌ Error requesting OTP');
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await axios.post('/api/users/verify-otp', { email, otp });
            setStep(3);
            setMessage('🎉 Signup successful! You can now log in.');
        } catch (err) {
            setMessage(err.response?.data?.message || '❌ Error verifying OTP');
        }
        setLoading(false);
    };

    const progressTitles = ['Enter Details', 'Verify OTP'];

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
                <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#111827' }}>Create an Account</h2>

                {/* Step Indicator */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 32
                }}>
                    {progressTitles.map((title, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: step > index ? '#3b82f6' : '#d1d5db',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 14,
                                transition: 'background 0.3s'
                            }}>
                                {index + 1}
                            </div>
                            <span style={{ margin: '0 12px', fontSize: 14, color: '#6b7280' }}>{title}</span>
                            {index !== progressTitles.length - 1 && (
                                <div style={{
                                    width: 30,
                                    height: 2,
                                    backgroundColor: step > index + 1 ? '#3b82f6' : '#d1d5db',
                                    transition: 'background 0.3s'
                                }}></div>
                            )}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{
                                padding: 14,
                                borderRadius: 10,
                                border: '1px solid #d1d5db',
                                fontSize: 15
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{
                                padding: 14,
                                borderRadius: 10,
                                border: '1px solid #d1d5db',
                                fontSize: 15
                            }}
                        />
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
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                transition: '0.3s'
                            }}
                        >
                            {loading ? 'Requesting OTP...' : 'Request OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            required
                            style={{
                                padding: 14,
                                borderRadius: 10,
                                border: '1px solid #d1d5db',
                                fontSize: 16,
                                textAlign: 'center',
                                letterSpacing: 4
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                backgroundColor: '#10b981',
                                color: '#fff',
                                padding: 14,
                                border: 'none',
                                borderRadius: 10,
                                fontSize: 16,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                transition: '0.3s'
                            }}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎉</div>
                        <h3 style={{ marginBottom: 8, color: '#10b981' }}>Signup successful!</h3>
                        <a
                            href="/login"
                            style={{
                                display: 'inline-block',
                                marginTop: 16,
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                padding: '12px 20px',
                                borderRadius: 8,
                                textDecoration: 'none',
                                fontWeight: 500
                            }}
                        >
                            Go to Login
                        </a>
                    </div>
                )}

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
            </div>
        </div>
    );
};

export default Signup;
