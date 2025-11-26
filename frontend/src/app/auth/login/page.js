'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.login(formData);
      if (result.message === 'Login successful') {
        router.push('/dashboard');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Login</h1>

        {error && (
          <div className="errorMessage">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div>
            <label htmlFor="identifier" className="label">
              Username or Email
            </label>
            <input
              type="text"
              id="identifier"
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              required
              className="input"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submitButton"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="signupText">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="signup-Link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

