import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, Loader2, RefreshCcw } from 'lucide-react';
import ResultSummary from '../components/ResultSummary';
import DetailView from '../components/DetailView';

export default function Result() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [showDetails, setShowDetails] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [heatmapBase64, setHeatmapBase64] = useState(null);

    if (!state || !state.prediction) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">No results found</h2>
                <button onClick={() => navigate('/dashboard')} className="text-brand-green-600 font-bold hover:underline">
                    Go back to dashboard
                </button>
            </div>
        );
    }

    const { prediction } = state;

    const handleExplain = async () => {
        if (!prediction.id) {
            setShowDetails(true);
            return;
        }

        setIsLoadingDetails(true);
        try {
            const res = await fetch(`http://127.0.0.1:5000/heatmap/${prediction.id}`);
            if (res.ok) {
                const data = await res.json();
                setHeatmapBase64(data.heatmap);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingDetails(false);
            setShowDetails(true);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-brand-green-600 font-semibold transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold transition-colors text-sm"
                >
                    <RefreshCcw className="w-4 h-4" /> Try another image
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Left Column - Original Image and optionally Detailed View underneath */}
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-brand-green-500" />
                            Analyzed Leaf
                        </h3>
                        <div className="aspect-video md:aspect-square lg:aspect-video rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-50 relative">
                            <img src={prediction.image_url} alt="Uploaded leaf" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {showDetails && (
                        <div className="hidden lg:block">
                            <DetailView prediction={prediction} heatmapBase64={heatmapBase64} />
                        </div>
                    )}
                </div>

                {/* Right Column - Results Data */}
                <div className="space-y-6">
                    <ResultSummary prediction={prediction} />

                    {!showDetails ? (
                        <button
                            onClick={handleExplain}
                            disabled={isLoadingDetails}
                            className="w-full py-4 border-2 border-brand-green-600 text-brand-green-700 font-bold rounded-2xl hover:bg-brand-green-50 transition-colors flex justify-center items-center gap-2"
                        >
                            {isLoadingDetails ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Explain in Detail'}
                        </button>
                    ) : (
                        <div className="lg:hidden">
                            <DetailView prediction={prediction} heatmapBase64={heatmapBase64} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
