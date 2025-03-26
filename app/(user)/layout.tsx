'use client';
import React, { useState, ReactNode, useRef, useEffect } from 'react';
import { Menu, MessageSquare, Bookmark, PlusCircle, Users, ShoppingBag, BadgePlus, Bell, HelpCircle, Settings, Shield, ChevronLeft, Search, Sun, Grid, User, PencilRuler, HomeIcon, LucideProps, SettingsIcon, Wand, Stamp, AmpersandsIcon, HamIcon, AtomIcon, ActivitySquareIcon, DockIcon, ScanIcon, AlbumIcon, MapIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname,useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement | null>(null); // Reference for the dropdown menu

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const menuItems = [
        { title: 'Dashboard', icon: HomeIcon, path: '/home' },
        { title: 'Portfolio', icon: Grid, path: '/socialDashboard' },
        { title: 'Create Post', icon: PlusCircle, path: '/createPost' },
        { title: 'Generate Content', icon: Wand, path: '/contentGeneration' },
        { title: 'Messages', icon: MessageSquare, path: '/chat' },
        { title: 'Saved', icon: Bookmark, path: '/saved' },
        { title: 'Help Center', icon: HelpCircle, path: '/help-center' },
        { title: 'Settings', icon: Settings, path: '/settings' }
    ];
    const handleAccountClick = () => {
        const username=session?.user?.username
        if (username) {
            router.push(`/profile/${username}`);
        } else {
            console.error("No username found in session");
        }
        setIsMenuOpen(false);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className={`fixed top-0 left-0 h-full bg-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} shadow-lg z-10`}>
                <div className="flex items-center justify-between p-4 border-b">
                    <Link href="/home" className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">SH</span>
                        </div>
                        {!isCollapsed && <span className="ml-2 font-semibold">Social Hub</span>}
                    </Link>
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 rounded hover:bg-gray-100">
                        <ChevronLeft className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} size={20} />
                    </button>
                </div>

                <nav className="mt-4 h-[calc(100vh-5rem)] overflow-y-auto">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Link key={index} href={item.path} className={`w-full flex items-center p-3 transition-colors ${isCollapsed ? 'justify-center' : 'px-4'} ${pathname === item.path ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <Icon size={20} />
                                {!isCollapsed && <span className="ml-3">{item.title}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className={`flex-1 top-0 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <header className="bg-white shadow-sm sticky top-0 z-20">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center flex-1">
                            <div className="relative w-96">
                                <input type="text" placeholder="Search Influencers, businesses, and products" className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 animate-placeholder" />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 hover:bg-gray-100 rounded-lg"><Grid size={20} /></button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg"><Sun size={20} /></button>
                            <button className="relative p-2 hover:bg-gray-100 rounded-lg"><Bell size={20} /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button>
                            <div className="relative" ref={menuRef}>
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User size={20} />
                                </button>
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-30">
                                        <button
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            onClick={handleAccountClick}
                                        >
                                            Account
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            onClick={async () => {
                                                try {
                                                    await signOut({ callbackUrl: "/login" }); // ✅ Sign out from NextAuth
                                                } catch (err) {
                                                    console.error("Logout failed:", err);
                                                }
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>
                <main className="p-6 bg-gray-100">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
