import { ShieldAlert, CheckCircle, Info } from 'lucide-react';

export default function ResultSummary({ prediction }) {
    const isHealthy = prediction.disease.toLowerCase() === 'healthy';

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-6 self-start ${isHealthy ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {isHealthy ? <CheckCircle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                    {isHealthy ? 'Healthy Plant Detected' : 'Disease Detected'}
                </div>

                <div className="space-y-1 mb-8">
                    <p className="text-slate-500 font-medium">Plant Type</p>
                    <h2 className="text-3xl font-black text-slate-800">{prediction.plant}</h2>
                </div>

                <div className="space-y-1 mb-8">
                    <p className="text-slate-500 font-medium">Diagnosis</p>
                    <h2 className={`text-4xl font-black ${isHealthy ? 'text-emerald-600' : 'text-red-600'}`}>
                        {prediction.disease}
                    </h2>
                </div>

                <div className="mt-auto bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="mb-4">
                        <h4 className="font-bold text-slate-700 text-sm mb-1 uppercase tracking-wider">Cause</h4>
                        <p className="text-slate-600 font-medium">{prediction.cause}</p>
                    </div>
                    <div className="mb-4">
                        <h4 className="font-bold text-slate-700 text-sm mb-1 uppercase tracking-wider">Effect</h4>
                        <p className="text-slate-600 font-medium">{prediction.effect}</p>
                    </div>
                    <div className="bg-brand-green-50 p-4 rounded-xl border border-brand-green-100 relative overflow-hidden mt-6">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Info className="w-16 h-16 text-brand-green-600" />
                        </div>
                        <h4 className="font-bold text-brand-green-800 text-sm mb-2 uppercase tracking-wider relative z-10">Prevention & Treatment</h4>
                        <p className="text-brand-green-900 leading-relaxed font-medium relative z-10">
                            {prediction.prevention}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
