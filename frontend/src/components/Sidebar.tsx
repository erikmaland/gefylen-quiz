'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { 
  HomeIcon, 
  AcademicCapIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Logo } from './Logo';

const baseNavigation = [
  { name: 'Hjem', href: '/', icon: HomeIcon },
  { name: 'Meny', href: '/menu', icon: BuildingStorefrontIcon },
  { name: 'Quiz', href: '/quiz', icon: AcademicCapIcon },
];

const adminItems = [
  { name: 'Administrer oppskrifter', href: '/admin/recipes', icon: BookOpenIcon },
  { name: 'Administrer quiz', href: '/admin/quiz', icon: ShieldCheckIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get navigation items based on auth status
  const navigation = isAuthenticated ? [...baseNavigation, ...adminItems] : baseNavigation;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const NavLinks = () => (
    <nav className="flex-1 space-y-1 px-4 py-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <item.icon
              className={cn(
                'mr-3 h-5 w-5 flex-shrink-0',
                isActive
                  ? 'text-indigo-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:hidden',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo section */}
          <div className="flex h-16 shrink-0 items-center border-b px-6">
            <Logo />
          </div>
          <NavLinks />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full w-64 flex-col bg-white border-r">
        {/* Logo section */}
        <div className="flex h-16 shrink-0 items-center border-b px-6">
          <Logo />
        </div>
        <NavLinks />
      </div>
    </>
  );
} 