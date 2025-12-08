import React, { useState } from 'react';

function Register({ onRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName })
            });
            if (!res.ok) throw new Error('Đăng ký thất bại!');
            setSuccess('Đăng ký thành công!');
            onRegister && onRegister();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Đăng ký</h2>
            <input type="text" placeholder="Họ tên" value={fullName} onChange={e => setFullName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Đăng ký</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
        </form>
    );
}

export default Register;
