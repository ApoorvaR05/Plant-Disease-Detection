import { Code2, BrainCircuit, Layout, User } from 'lucide-react';

export default function About() {
    const technologies = [
        { name: "YOLOv11", role: "AI Object Detection Model", icon: <BrainCircuit className="w-6 h-6" /> },
        { name: "PyTorch", role: "Deep Learning Framework", icon: <Code2 className="w-6 h-6" /> },
        { name: "Flask", role: "Python API Backend", icon: <Code2 className="w-6 h-6" /> },
        { name: "React.js", role: "Frontend Framework", icon: <Layout className="w-6 h-6" /> },
        { name: "OpenCV", role: "Image Processing & Heatmaps", icon: <BrainCircuit className="w-6 h-6" /> }
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-6">About the Project</h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                    The <strong>AI Powered Plant Disease Detection System</strong> is built to bridge the gap between advanced deep learning algorithms and everyday agricultural practices. By leveraging mobile-friendly technologies, we make expert-level plant pathology accessible to everyone.
                </p>
            </div>

            <div className="mb-16">
                <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-brand-green-200 pb-2 mb-8 inline-block">
                    Technologies Used
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {technologies.map((tech, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                            <div className="bg-brand-green-50 text-brand-green-600 p-3 rounded-xl">
                                {tech.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{tech.name}</h3>
                                <p className="text-sm text-slate-500">{tech.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-brand-green-200 pb-2 mb-8 inline-block">
                    Team Members
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                    {/* Add your team members here */}
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="bg-slate-100 p-4 rounded-full text-slate-400">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Team Member {num}</h3>
                                <p className="text-brand-green-600 text-sm font-medium">Developer / AI Engineer</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
