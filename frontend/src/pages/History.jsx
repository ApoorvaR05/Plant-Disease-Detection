import HistoryList from '../components/HistoryList';
import { Clock } from 'lucide-react';

export default function History() {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-brand-green-100 p-3 rounded-xl text-brand-green-600">
                    <Clock className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-800">Prediction History</h1>
            </div>
            <HistoryList />
        </div>
    );
}
