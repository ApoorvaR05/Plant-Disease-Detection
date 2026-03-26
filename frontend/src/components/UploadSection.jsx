import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, Image as ImageIcon, Loader2, X, Aperture } from 'lucide-react';

export default function UploadSection() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Camera state
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [stream, setStream] = useState(null);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    // Clean up camera stream on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

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

    const startCamera = async () => {
        setError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setIsCameraActive(true);
        } catch (err) {
            console.error("Camera error:", err);
            setError("Could not access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraActive(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Set canvas to video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
                setSelectedImage(file);
                setPreviewUrl(URL.createObjectURL(file));
                stopCamera();
            }
        }, 'image/jpeg', 0.9);
    };

    const handleDetect = async () => {
        if (!selectedImage) return;

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedImage);

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get prediction from the server.');
            }

            const predictionObj = {
                id: data.history_id,
                plant: data.plant,
                disease: data.disease,
                cause: data.cause,
                effect: data.effect,
                prevention: data.prevention,
                confidence: data.confidence,
                image_url: previewUrl
            };

            navigate('/result', { state: { prediction: predictionObj } });
        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred during detection.');
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center">

            {/* Hidden canvas for capturing frames */}
            <canvas ref={canvasRef} className="hidden" />

            {!previewUrl ? (
                <>
                    {/* Live Camera View */}
                    {isCameraActive ? (
                        <div className="w-full flex flex-col items-center mb-8">
                            <div className="relative rounded-2xl overflow-hidden shadow-md max-w-lg w-full bg-black mb-4 aspect-video sm:aspect-square md:aspect-video flex items-center justify-center">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={capturePhoto}
                                    className="px-6 py-3 bg-brand-green-600 text-white font-bold rounded-xl hover:bg-brand-green-700 transition flex items-center gap-2"
                                >
                                    <Aperture className="w-5 h-5" /> Take Picture
                                </button>
                                <button
                                    onClick={stopCamera}
                                    className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition flex items-center gap-2"
                                >
                                    <X className="w-5 h-5" /> Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
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
                                onClick={startCamera}
                                className="flex-1 min-w-[200px] aspect-video border-2 border-dashed border-brand-green-300 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-brand-green-50 hover:border-brand-green-500 transition-colors group cursor-pointer"
                            >
                                <div className="bg-brand-green-100 p-4 rounded-full group-hover:bg-brand-green-200 transition-colors">
                                    <Camera className="w-8 h-8 text-brand-green-600" />
                                </div>
                                <span className="font-bold text-slate-700">Open Camera</span>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="w-full mb-8 flex flex-col items-center">
                    <div className="relative rounded-2xl overflow-hidden shadow-md max-w-sm w-full mx-auto border-4 border-white h-64 bg-slate-100">
                        <img src={previewUrl} alt="Leaf preview" className="w-full h-full object-cover" />
                    </div>
                    <button
                        onClick={clearSelection}
                        className="mt-4 text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                        <X className="w-4 h-4" /> Clear and try another
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

            {/* Hide Detect button if camera is active, it only makes sense when an image is selected */}
            {!isCameraActive && (
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
            )}
        </div>
    );
}
