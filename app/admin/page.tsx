'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Users, FolderOpen, Settings, ShoppingBag, Upload, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminImport from "@/components/admin/AdminImport";
import AdminSponsors from "@/components/admin/AdminSponsors";
import { apiRequest, getToken, removeToken } from "@/lib/queryClient";

type AdminSection = 'categories' | 'orders' | 'users' | 'settings' | 'import' | 'sponsors';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('categories');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        await apiRequest('/api/auth/session');
        setIsAuthenticated(true);
      } catch (error) {
        removeToken();
        router.push('/admin/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    removeToken();
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      // Ignorar errores en logout
    }
    router.push('/admin/login');
  };

  const menuItems = [
    {
      id: 'categories' as AdminSection,
      title: 'Categorías y Productos',
      icon: FolderOpen,
    },
    {
      id: 'import' as AdminSection,
      title: 'Importar Excel',
      icon: Upload,
    },
    {
      id: 'orders' as AdminSection,
      title: 'Pedidos',
      icon: ShoppingBag,
    },
    {
      id: 'sponsors' as AdminSection,
      title: 'Patrocinadores',
      icon: Heart,
    },
    {
      id: 'users' as AdminSection,
      title: 'Usuarios Administrativos',
      icon: Users,
    },
    {
      id: 'settings' as AdminSection,
      title: 'Configuración del Sitio',
      icon: Settings,
    },
  ];

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-lg font-display font-semibold px-4 py-4">
                FV BODEGONES
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        data-testid={`nav-${item.id}`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="font-display font-semibold text-xl">
              Panel Administrativo
            </h1>
            <div className="w-10" />
          </header>

          <main className="flex-1 overflow-auto p-6">
            {activeSection === 'categories' && <AdminCategories />}
            {activeSection === 'import' && <AdminImport />}
            {activeSection === 'orders' && <AdminOrders />}
            {activeSection === 'sponsors' && <AdminSponsors />}
            {activeSection === 'users' && <AdminUsers />}
            {activeSection === 'settings' && <AdminSettings />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}



