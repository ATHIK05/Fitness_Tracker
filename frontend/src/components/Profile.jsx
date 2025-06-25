import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://fitness-tracker-sfug.vercel.app';

const Profile = ({ user }) => {
  const [profile, setProfile] = useState({ name: '', age: '', weight: '', height: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${user._id}/profile`);
        setProfile(res.data);
      } catch (err) {
        setError('Failed to fetch profile.');
      }
      setLoading(false);
    };
    if (user && user._id) fetchProfile();
  }, [user]);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.patch(`${API_BASE_URL}/api/users/${user._id}/profile`, profile);
      setProfile(res.data.user);
      setMessage('Profile updated!');
      setEdit(false);
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading profile...</div>;

  return (
    <div className="card" style={{ maxWidth: 480, margin: '40px auto' }}>
      <h2 style={{ marginBottom: 18 }}>Profile</h2>
      {profile.avatar && (
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <img src={profile.avatar} alt="avatar" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }} />
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label>
          Name
          <input name="name" value={profile.name || ''} onChange={handleChange} disabled={!edit} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', marginTop: 4 }} />
        </label>
        <label>
          Age
          <input name="age" type="number" value={profile.age || ''} onChange={handleChange} disabled={!edit} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', marginTop: 4 }} />
        </label>
        <label>
          Weight (kg)
          <input name="weight" type="number" value={profile.weight || ''} onChange={handleChange} disabled={!edit} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', marginTop: 4 }} />
        </label>
        <label>
          Height (cm)
          <input name="height" type="number" value={profile.height || ''} onChange={handleChange} disabled={!edit} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', marginTop: 4 }} />
        </label>
        <label>
          Avatar URL
          <input name="avatar" value={profile.avatar || ''} onChange={handleChange} disabled={!edit} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', marginTop: 4 }} />
        </label>
        {edit ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="button" style={{ flex: 1 }}>Save</button>
            <button type="button" className="button" style={{ flex: 1, background: '#e5e7eb', color: '#222' }} onClick={() => { setEdit(false); setMessage(''); setError(''); }}>Cancel</button>
          </div>
        ) : (
          <button type="button" className="button" onClick={() => setEdit(true)} style={{ width: '100%' }}>Edit Profile</button>
        )}
      </form>
      {message && <div style={{ color: 'var(--color-accent)', marginTop: 12 }}>{message}</div>}
      {error && <div style={{ color: 'crimson', marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default Profile; 