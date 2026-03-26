import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User } from 'lucide-react';
import { useEffect } from 'react';

export default function Navbar({ user, logout }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!document.getElementById('google-translate-script')) {
            const addScript = document.createElement('script');
            addScript.id = 'google-translate-script';
            addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.body.appendChild(addScript);

            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement(
                    { pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
                    'google_translate_element'
                );
            };
        }
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const publicLinks = [
        { name: 'Home', path: '/' },
        { name: 'Login', path: '/login' },
    ];

    const privateLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'History', path: '/history' },
    ];

    const links = user ? privateLinks : publicLinks;

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex justify-between h-16 items-center">
                    <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-brand-green-600 font-bold text-xl hover:text-brand-green-700 transition">
                        <Leaf className="w-6 h-6" />
                        <span>PlantCare AI</span>
                    </Link>

                    <div className="flex space-x-6 items-center">
                        <div id="google_translate_element" className="pt-2"></div>

                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium transition ${location.pathname === link.path
                                    ? 'text-brand-green-600 border-b-2 border-brand-green-600'
                                    : 'text-slate-500 hover:text-brand-green-500'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {user && (
                            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <User className="w-4 h-4" />
                                    <span className="hidden sm:inline">{user.email}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
