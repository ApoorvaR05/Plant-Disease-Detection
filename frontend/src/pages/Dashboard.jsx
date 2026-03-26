import { Link } from 'react-router-dom';
import UploadSection from '../components/UploadSection';
import HistoryList from '../components/HistoryList';

export default function Dashboard() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-12">
            <div>
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Diagnosis Dashboard</h1>
                    <p className="text-slate-600">
                        Upload a clear photo of the plant leaf to get an instant AI analysis and treatment plan.
                    </p>
                </div>

                <UploadSection />
            </div>

            <div className="pt-8 border-t border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Recent Activity</h2>
                    <Link to="/history" className="text-sm font-bold text-brand-green-600 hover:underline">
                        View Full History
                    </Link>
                </div>
                <HistoryList limit={3} />
            </div>
        </div>
    );
}
