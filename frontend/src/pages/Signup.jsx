import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Loader2 } from 'lucide-react';

export default function Signup({ login }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Register
            const res = await fetch('http://127.0.0.1:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                // Auto login
                const loginRes = await fetch('http://127.0.0.1:5000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const loginData = await loginRes.json();
                if (loginRes.ok) {
                    login(loginData.token, loginData.email);
                    navigate('/dashboard');
                } else {
                    navigate('/login');
                }
            } else {
                setError(data.error || 'Signup failed');
            }
        } catch (err) {
            setError('Network error. Is the server running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-16 px-4">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                <div className="bg-brand-green-100 p-4 rounded-full text-brand-green-600 mb-6">
                    <Leaf className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Create Account</h1>
                <p className="text-slate-500 mb-8 text-center">Join PlantCare AI to keep track of all your plant health analyses.</p>

                {error && <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-green-500 focus:ring-1 focus:ring-brand-green-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-green-500 focus:ring-1 focus:ring-brand-green-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-brand-green-600 text-white font-bold rounded-xl hover:bg-brand-green-700 transition flex justify-center items-center gap-2 mt-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-slate-600">
                    Already have an account? <Link to="/login" className="text-brand-green-600 font-bold hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}
