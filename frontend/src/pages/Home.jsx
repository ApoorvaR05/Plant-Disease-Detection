import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Leaf } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mb-16">
                <div className="flex justify-center mb-6">
                    <div className="bg-brand-green-100 p-4 rounded-full text-brand-green-600">
                        <Leaf className="w-16 h-16" />
                    </div>
                </div>
                <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight mb-6">
                    AI Powered Plant Disease Detection
                </h1>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                    Empowering farmers and plant lovers with cutting-edge YOLOv11 AI to instantly identify crop diseases and get actionable treatment suggestions.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        to="/dashboard"
                        className="px-8 py-4 bg-brand-green-600 text-white rounded-xl font-bold text-lg hover:bg-brand-green-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        Start Detection
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
                {[
                    {
                        icon: <Zap className="w-8 h-8 text-amber-500" />,
                        title: "Lightning Fast",
                        desc: "Powered by YOLOv11, our system analyzes leaf images in milliseconds, providing real-time results."
                    },
                    {
                        icon: <ShieldCheck className="w-8 h-8 text-brand-green-500" />,
                        title: "High Accuracy",
                        desc: "Trained on thousands of images from PlantVillage to recognize diseases with up to 96% confidence."
                    },
                    {
                        icon: <Leaf className="w-8 h-8 text-emerald-500" />,
                        title: "Actionable Insights",
                        desc: "Not just detection. We provide detailed treatment suggestions and heatmap visualizations."
                    }
                ].map((feature, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition">
                        <div className="bg-slate-50 p-4 rounded-full mb-4">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                        <p className="text-slate-600">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
