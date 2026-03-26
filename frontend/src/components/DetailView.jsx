import { Activity, Beaker } from 'lucide-react';

export default function DetailView({ prediction, heatmapBase64 }) {
    const isHealthy = prediction.disease.toLowerCase() === 'healthy';
    const confidencePercent = Math.round(prediction.confidence * 100);

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="border-b border-slate-100 pb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-brand-green-600" /> AI Confidence Breakdown
                </h3>
                <p className="text-slate-500 text-sm">
                    How confident is the YOLOv11 deep learning model in this diagnosis?
                </p>
            </div>

            <div className="mb-8 w-full">
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                    <span>Confidence Score</span>
                    <span>{confidencePercent}%</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ${isHealthy ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${confidencePercent}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Beaker className="w-5 h-5 text-amber-500" /> Explainability Analysis (Grad-CAM)
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    The AI generated this heatmap to highlight which areas of the leaf contributed most to its final prediction. Red areas indicate high attention.
                </p>

                {heatmapBase64 ? (
                    <div className="aspect-video sm:aspect-square md:aspect-video rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-50 relative mt-4">
                        <img src={`data:image/jpeg;base64,${heatmapBase64}`} alt="Grad-CAM Heatmap" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="aspect-video bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border-2 border-slate-100 border-dashed">
                        Heatmap unavailable
                    </div>
                )}
            </div>

        </div>
    );
}
