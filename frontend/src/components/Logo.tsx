import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="block p-4 hover:opacity-80 transition-opacity">
      <div className="text-2xl font-bold tracking-wider text-indigo-600">
        <span className="inline-block transform hover:rotate-50 transition-transform">G</span>
        <span className="inline-block transform hover:-rotate-60 transition-transform">E</span>
        <span className="inline-block transform hover:rotate-30 transition-transform">F</span>
        <span className="inline-block transform hover:-rotate-60 transition-transform">Y</span>
        <span className="inline-block transform hover:rotate-50 transition-transform">L</span>
        <span className="inline-block transform hover:-rotate-40 transition-transform">E</span>
        <span className="inline-block transform hover:rotate-30 transition-transform">N</span>
      </div>
      <div className="text-xs text-gray-500 tracking-widest">VIRTUELL CAFÉ</div>
    </Link>
  );
} 