'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import ThemeToggle from '@/components/ThemeToggle';
import Icon from '@/components/Icon';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navItems = [
    { href: '/admin',               label: 'สินค้าทั้งหมด',       icon: 'box'       },
    { href: '/admin/new',           label: 'เพิ่มสินค้า',         icon: 'plus'      },
    { href: '/admin/announcements', label: 'ประกาศ / แบนเนอร์', icon: 'megaphone' },
    { href: '/admin/settings',      label: 'แก้ไขเนื้อหาเว็บ',    icon: 'pencil'    },
    { href: '/',                    label: 'ดูหน้าเว็บหลัก',   icon: 'globe'     },
  ];

  // Allow login page to render without auth guard
  if (pathname === '/admin/login') return children;

  return (
    <ProtectedRoute>
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-logo">Su Sell Admin</div>

          <nav style={{ flex: 1 }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${
                  item.href === '/admin'
                    ? pathname === '/admin'
                      ? 'active'
                      : ''
                    : pathname.startsWith(item.href)
                    ? 'active'
                    : ''
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <ThemeToggle />
            <button
              id="admin-logout"
              onClick={handleLogout}
              className="btn btn-ghost btn-sm"
            >
              ออกจากระบบ
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
