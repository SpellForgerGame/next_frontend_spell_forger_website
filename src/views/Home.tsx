import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ScrollText, Users, TrendingUp, Wand2, BookOpen, Star } from 'lucide-react';
import heroImage from '@/assets/hero-spellforge.jpg';

const Home: React.FC = () => {
  return (
    // 1. REMOVI O 'bg-background' DAQUI 👇
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          // 2. ADICIONEI O '.src' AQUI PARA A IMAGEM FUNCIONAR NO NEXT.JS 👇
          style={{ backgroundImage: `url(${heroImage.src})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 animate-float">
            <div className="p-3 bg-gradient-primary rounded-full shadow-magical">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight md:leading-normal">
            Welcome to SpellForger
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            A collaborative platform where wizards, sorcerers, and magical enthusiasts come together 
            to create, share, and refine spells for the ultimate magical knowledge base.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/spells">
              <Button size="lg" className="text-lg px-8 py-6 shadow-gold hover:animate-magical-glow">
                <ScrollText className="w-5 h-5 mr-2" />
                Explore Spells
              </Button>
            </Link>
            
            <Link href="/register">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Wand2 className="w-5 h-5 mr-2" />
                Join the Guild
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* Adicionei um backdrop-blur aqui para o texto ficar legível sobre a imagem de fundo */}
      <section className="py-20 px-4 bg-muted/20 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Shape the Future of Magic
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every spell you create and every vote you cast helps train the next generation 
              of magical AI assistants.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-magical transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mb-4 group-hover:animate-magical-glow">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-gold transition-colors">
                  Create Spells
                </h3>
                <p className="text-muted-foreground">
                  Submit your original spell ideas with detailed descriptions, effects, and magical properties.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-magical transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mb-4 group-hover:animate-magical-glow">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-gold transition-colors">
                  Vote & Rank
                </h3>
                <p className="text-muted-foreground">
                  Help curate the best spells by voting on creativity, usefulness, and magical authenticity.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-magical transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mb-4 group-hover:animate-magical-glow">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-gold transition-colors">
                  Build Together
                </h3>
                <p className="text-muted-foreground">
                  Collaborate with fellow magical practitioners to create a comprehensive spell database.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2 group-hover:animate-magical-glow">
                ∞
              </div>
              <div className="text-sm text-muted-foreground">
                Magical Possibilities
              </div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2 group-hover:animate-magical-glow">
                <Star className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-sm text-muted-foreground">
                Community Driven
              </div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2 group-hover:animate-magical-glow">
                AI
              </div>
              <div className="text-sm text-muted-foreground">
                Enhanced Learning
              </div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2 group-hover:animate-magical-glow">
                24/7
              </div>
              <div className="text-sm text-muted-foreground">
                Always Growing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary/5 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Ready to Begin Your Magical Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of magical practitioners contributing to the future of spell-casting AI.
          </p>
          <Link href="/spells">
            <Button size="lg" className="text-lg px-8 py-6 shadow-gold hover:animate-magical-glow">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Exploring Magic
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;