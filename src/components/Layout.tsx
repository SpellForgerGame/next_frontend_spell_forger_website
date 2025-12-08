'use client'; // 👈 Essencial

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sparkles, Home, ScrollText, PlusCircle, LogIn, UserPlus, LogOut } from 'lucide-react';

// 👇 1. IMPORTAÇÃO DA IMAGEM (Ajuste a extensão .jpg/.png se necessário)
import bgImage from '../assets/hero-spellforge.jpg';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    // 👇 2. AQUI ESTÁ A MUDANÇA PARA A IMAGEM APARECER
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ 
        backgroundImage: `url(${bgImage.src})` 
      }}
    >
      {/* Navigation */}
      <nav className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-magical group-hover:animate-magical-glow transition-all duration-300">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SpellForger
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/">
                <Button 
                  variant={isActive('/') ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
              
              <Link href="/spells">
                <Button 
                  variant={isActive('/spells') ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <ScrollText className="w-4 h-4" />
                  Spells
                </Button>
              </Link>

              {isAuthenticated && (
                <Link href="/submit">
                  <Button 
                    variant={isActive('/submit') ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Submit a Spell
                  </Button>
                </Link>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    Welcome, {user?.username}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={logout}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button 
                      variant={isActive('/login') ? 'default' : 'ghost'}
                      size="sm"
                      className="gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="hidden sm:inline">Login</span>
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      variant={isActive('/register') ? 'default' : 'outline'}
                      size="sm"
                      className="gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span className="hidden sm:inline">Register</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <div className="flex flex-wrap gap-2">
              <Link href="/">
                <Button 
                  variant={isActive('/') ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
              
              <Link href="/spells">
                <Button 
                  variant={isActive('/spells') ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <ScrollText className="w-4 h-4" />
                  Spells
                </Button>
              </Link>

              {isAuthenticated && (
                <Link href="/submit">
                  <Button 
                    variant={isActive('/submit') ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Submit
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;