import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function Detection() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
        }
    };

    const clearSelection = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDetect = async () => {
        if (!selectedImage) return;

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedImage);

        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to get prediction from the server.');
            }

            const data = await response.json();

            // Navigate to result page with data
            navigate('/result', { state: { prediction: data, imageUrl: previewUrl } });
        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred during detection.');
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Detect Plant Disease</h1>
                <p className="text-slate-600">
                    Upload a clear photo of the plant leaf or take a picture using your camera to get an instant AI analysis.
                </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center">
                {!previewUrl ? (
                    <div className="w-full flex justify-center gap-6 mb-8 flex-wrap">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 min-w-[200px] aspect-video border-2 border-dashed border-brand-green-300 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-brand-green-50 hover:border-brand-green-500 transition-colors group cursor-pointer"
                        >
                            <div className="bg-brand-green-100 p-4 rounded-full group-hover:bg-brand-green-200 transition-colors">
                                <Upload className="w-8 h-8 text-brand-green-600" />
                            </div>
                            <span className="font-bold text-slate-700">Upload Image</span>
                        </button>
                        <button
                            onClick={() => {
                                fileInputRef.current?.setAttribute('capture', 'environment');
                                fileInputRef.current?.click();
                            }}
                            className="flex-1 min-w-[200px] aspect-video border-2 border-dashed border-brand-green-300 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-brand-green-50 hover:border-brand-green-500 transition-colors group cursor-pointer"
                        >
                            <div className="bg-brand-green-100 p-4 rounded-full group-hover:bg-brand-green-200 transition-colors">
                                <Camera className="w-8 h-8 text-brand-green-600" />
                            </div>
                            <span className="font-bold text-slate-700">Take Photo</span>
                        </button>
                    </div>
                ) : (
                    <div className="w-full mb-8 flex flex-col items-center">
                        <div className="relative rounded-2xl overflow-hidden shadow-md max-w-sm w-full mx-auto border-4 border-white h-64 bg-slate-100">
                            <img src={previewUrl} alt="Leaf preview" className="w-full h-full object-cover" />
                        </div>
                        <button
                            onClick={clearSelection}
                            className="mt-4 text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors"
                        >
                            Choose different image
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />

                {error && (
                    <div className="w-full p-4 mb-6 bg-red-50 text-red-600 rounded-xl text-center text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleDetect}
                    disabled={!selectedImage || isLoading}
                    className={`w-full max-w-sm py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
            ${(!selectedImage || isLoading)
                            ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
                            : 'bg-brand-green-600 text-white hover:bg-brand-green-700 hover:shadow-xl'
                        }
          `}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Analyzing Image...
                        </>
                    ) : (
                        <>
                            <ImageIcon className="w-6 h-6" />
                            Detect Disease
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
