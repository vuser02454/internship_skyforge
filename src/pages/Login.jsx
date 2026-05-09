import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [message, setMessage] = useState('');

  // ---------------------------------------------------
  // LOGIN FUNCTION
  // ---------------------------------------------------
  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError('');
    setMessage('');

    // Optional Backend Health Check
    try {

      const apiResponse = await fetch('http://127.0.0.1:5000/api/health');

      if (!apiResponse.ok) {
        throw new Error('Backend API not responding');
      }

    } catch (err) {

      setError('Flask backend not running');
      setLoading(false);
      return;
    }

    // Supabase Login
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {

      setError(error.message);
      setLoading(false);

    } else {

      setMessage('Login successful');

      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };

  // ---------------------------------------------------
  // FORGOT PASSWORD
  // ---------------------------------------------------
  const handleForgotPassword = async () => {

    if (!email) {
      setError('Please enter your email first');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://192.168.1.44:5173/reset-password'
    });

    if (error) {

      setError(error.message);

    } else {

      setMessage('Password reset email sent');
    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          TaskForge Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}
          <div className="mb-4">

            <label className="block mb-2 font-semibold">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full border rounded-lg p-3"
            />

          </div>

          {/* PASSWORD */}
          <div className="mb-4">

            <div className="flex justify-between mb-2">

              <label className="font-semibold">
                Password
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-blue-600 text-sm hover:underline"
              >
                Forgot Password?
              </button>

            </div>

            <div className="relative">

              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border rounded-lg p-3"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-gray-600"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>

            </div>

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>

        </form>

        {/* SIGNUP LINK */}
        <div className="mt-6 text-center">

          <p>
            Don't have an account?
          </p>

          <Link
            to="/signup"
            className="text-blue-600 hover:underline"
          >
            Create Account
          </Link>

        </div>

      </div>

    </div>
  );
}