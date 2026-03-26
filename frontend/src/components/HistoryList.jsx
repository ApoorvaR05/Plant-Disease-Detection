import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';

export default function HistoryList({ limit }) {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Not authenticated');
                const res = await fetch('http://127.0.0.1:5000/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch history');
                const data = await res.json();
                setHistory(limit ? data.slice(0, limit) : data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [limit]);

    if (isLoading) return <div className="text-center py-8 text-slate-500">Loading history...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    if (history.length === 0) return <div className="text-center py-8 text-slate-500">No predictions yet.</div>;

    return (
        <div className="space-y-4">
            {history.map((item) => {
                const isHealthy = item.disease.toLowerCase() === 'healthy';
                const imageUrl = `http://127.0.0.1:5000${item.image_url}`;

                return (
                    <div
                        key={item.id}
                        className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-brand-green-300 transition-colors shadow-sm group cursor-pointer"
                        onClick={() => navigate('/result', { state: { prediction: { ...item, image_url: imageUrl } } })}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100">
                                <img src={imageUrl} alt={item.plant} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{item.plant}</h4>
                                <div className="flex items-center gap-2 text-sm mt-1">
                                    <span className={`px-2 py-0.5 rounded-md font-semibold ${isHealthy ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {item.disease}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-slate-400">
                            <div className="hidden sm:flex items-center gap-1 text-sm">
                                <Clock className="w-4 h-4" />
                                {new Date(item.timestamp).toLocaleDateString()}
                            </div>
                            <div className="bg-slate-50 p-2 rounded-full group-hover:bg-brand-green-50 group-hover:text-brand-green-600 transition-colors text-slate-300">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
