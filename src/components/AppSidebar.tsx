
import { Calendar, Settings, FileText, Package, ShoppingCart, Users, List } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: Calendar },
  { title: 'Management Order', url: '/orders', icon: ShoppingCart },
  { title: 'Daftar Order', url: '/order-list', icon: List },
  { title: 'Pelanggan', url: '/customers', icon: Users },
  { title: 'Stok', url: '/stock', icon: Package },
  { title: 'Laporan', url: '/reports', icon: FileText },
  { title: 'Pengaturan', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm' 
        : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground'
    }`;

  return (
    <Sidebar className="w-64 transition-all duration-300 bg-gradient-to-b from-orange-500 to-orange-600 border-r border-orange-400/20">
      {/* Header */}
      <div className="p-4 border-b border-orange-400/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Food Manager</h1>
            <p className="text-orange-100 text-sm">Sistem Manajemen Order</p>
          </div>
        </div>
      </div>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-100 text-xs uppercase tracking-wider mb-2">
            Menu Utama
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <div className="p-4 mt-auto border-t border-orange-400/20">
        <div className="text-center text-orange-100 text-xs">
          <p>© 2024 Food Manager</p>
          <p className="text-orange-200/60">v1.0.0</p>
        </div>
      </div>
    </Sidebar>
  );
}
