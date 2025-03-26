// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';
// import { useAuth } from '../context/AuthContext';
// import { useLanguage } from '../context/LanguageContext';

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const { t, changeLanguage } = useLanguage();

//   return (
//     <nav className="flex justify-between items-center p-4 bg-blue-900 text-white sticky top-0 z-50">
//       {/* Logo + Brand */}
//       <div className="flex items-center gap-2">
//         <Image 
//           src="/images/logo.png" 
//           alt="Rwenzori Logo"
//           width={40}
//           height={40}
//           className="rounded-full"
//         />
//         <Link href="/" className="text-2xl font-bold hover:text-blue-300">
//           The Rwenzoris
//         </Link>
//       </div>

//       {/* Main Navigation */}
//       <div className="hidden md:flex gap-6 items-center">
//         <Link href="/destinations" className="hover:text-blue-300">{t('explore')}</Link>
//         <Link href="/itinerary" className="hover:text-blue-300">{t('plan')}</Link>
//         <Link href="/blog" className="hover:text-blue-300">Blog</Link>
//         <Link href="/about" className="hover:text-blue-300">{t('about')}</Link>
//         <Link href="/contact" className="hover:text-blue-300">{t('contact')}</Link>
//       </div>

//       {/* Auth + Language */}
//       <div className="flex items-center gap-4">
//         {user ? (
//           <>
//             <Link href="/profile" className="hover:text-blue-300">{user.name}</Link>
//             <button onClick={logout} className="hover:text-blue-300">{t('logout')}</button>
//           </>
//         ) : (
//           <>
//             <Link href="/login" className="hover:text-blue-300">{t('login')}</Link>
//             <Link href="/register" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
//               {t('register')}
//             </Link>
//           </>
//         )}
//         <div className="flex gap-2 border-l pl-4">
//           <button onClick={() => changeLanguage('en')} className="hover:text-blue-300">EN</button>
//           <button onClick={() => changeLanguage('fr')} className="hover:text-blue-300">FR</button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// src/components/Navbar.js
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, changeLanguage } = useLanguage();

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-900 text-white sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Image src="/images/logo.png" alt="Rwenzori Logo" width={40} height={40} className="rounded-full" />
        <Link href="/" className="text-2xl font-bold hover:text-blue-300">
          The Rwenzoris
        </Link>
      </div>

      <div className="hidden md:flex gap-6 items-center">
        <Link href="/destinations" className="hover:text-blue-300">{t('explore')}</Link>
        <Link href="/itinerary" className="hover:text-blue-300">{t('plan')}</Link>
        <Link href="/blog" className="hover:text-blue-300">Blog</Link>
        <Link href="/about" className="hover:text-blue-300">{t('about')}</Link>
        <Link href="/contact" className="hover:text-blue-300">{t('contact')}</Link>
        {user && user.role === 'admin' && (
          <Link href="/admin" className="hover:text-blue-300">Admin Dashboard</Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/profile" className="hover:text-blue-300">{user.name}</Link>
            <button onClick={logout} className="hover:text-blue-300">{t('logout')}</button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-blue-300">{t('login')}</Link>
            <Link href="/register" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">{t('register')}</Link>
          </>
        )}
        <div className="flex gap-2 border-l pl-4">
          <button onClick={() => changeLanguage('en')} className="hover:text-blue-300">EN</button>
          <button onClick={() => changeLanguage('fr')} className="hover:text-blue-300">FR</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;