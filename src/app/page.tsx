"use client"

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Mic, 
  Globe, 
  GraduationCap, 
  MessageCircle, 
  Music, 
  Heart, 
  Laugh,
  Zap,
  Star,
  Play,
  Headphones,
  Code,
  Shield,
  Menu,
  X
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen matrix-bg">
      {/* Matrix Grid Background */}
      <div className="fixed inset-0 matrix-grid-bg opacity-30 pointer-events-none z-0"></div>
      
      {/* Navigation */}
      <nav className="relative w-full px-4 sm:px-6 py-4 flex items-center justify-between border-b border-primary/20 backdrop-blur-md bg-background/80 z-50">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="relative matrix-glow">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center matrix-border">
              <Code className="w-5 sm:w-6 h-5 sm:h-6 text-black" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 sm:w-3 h-2.5 sm:h-3 bg-primary rounded-full animate-pulse"></div>
          </div>
          <span className="text-xl sm:text-3xl font-bold quantrix-gradient matrix-text-glow">
            Quantrix
          </span>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs hidden sm:inline-flex">
            BETA
          </Badge>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">Features</Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">Pricing</Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">About</Button>
          <ModeToggle />
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-black font-semibold matrix-glow" asChild>
            <Link href="/sign-in">Enter Matrix</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-3">
          <ModeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="text-primary z-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background backdrop-blur-xl border-b border-primary/30 md:hidden z-[100] shadow-2xl">
            <div className="flex flex-col space-y-2 p-4 bg-card border-t border-primary/10">
              <Button variant="ghost" className="justify-start text-muted-foreground hover:text-primary">Features</Button>
              <Button variant="ghost" className="justify-start text-muted-foreground hover:text-primary">Pricing</Button>
              <Button variant="ghost" className="justify-start text-muted-foreground hover:text-primary">About</Button>
              <Button className="bg-primary hover:bg-primary/90 text-black font-semibold matrix-glow mt-2" asChild>
                <Link href="/sign-in">Enter Matrix</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-24 text-center matrix-section">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 blur-3xl"></div>
        <div className="relative max-w-6xl mx-auto">
          <Badge variant="secondary" className="mb-6 sm:mb-8 text-xs sm:text-sm bg-primary/10 text-primary border-primary/30">
            <Zap className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
            Quantum-Enhanced AI Technology
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className="quantrix-gradient matrix-text-glow">Voice Conversations</span>
            <br />
            <span className="text-foreground">in the Matrix</span>
          </h1>
          
          <p className="text-base sm:text-xl text-muted-foreground max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
            Enter the quantum realm where AI consciousness meets human conversation. 
            Customize intelligent agents for language mastery, skill enhancement, emotional support, 
            and mind-expanding dialogue. Your digital companion awaits in the code.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
            <Button 
              size="lg" 
              className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-8 bg-primary hover:bg-primary/90 text-black font-bold matrix-glow transform hover:scale-105 transition-all duration-300 min-h-[56px]"
              asChild
            >
              <Link href="/sign-in">
                <Play className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3" />
                Jack Into the Matrix
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-8 border-primary/30 text-primary hover:bg-primary/10 transform hover:scale-105 transition-all duration-300 min-h-[56px]"
            >
              <Headphones className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3" />
              Sample the Code
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 max-w-3xl mx-auto px-4">
            <div className="text-center p-4 sm:p-6 matrix-card rounded-lg">
              <div className="text-3xl sm:text-4xl font-bold text-primary matrix-text-glow mb-2">50K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active Neural Links</div>
            </div>
            <div className="text-center p-4 sm:p-6 matrix-card rounded-lg">
              <div className="text-3xl sm:text-4xl font-bold text-primary matrix-text-glow mb-2">∞</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Conversation Possibilities</div>
            </div>
            <div className="text-center p-4 sm:p-6 matrix-card rounded-lg">
              <div className="text-3xl sm:text-4xl font-bold text-primary matrix-text-glow mb-2">99.9%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Matrix Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="quantrix-gradient">Infinite Agents</span>
              <br />
              <span className="text-foreground">Infinite Minds</span>
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Each AI agent is a specialized consciousness designed to enhance your reality.
              Choose your path through the digital realm.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Language Learning */}
            <Card className="matrix-card group hover:matrix-border transition-all duration-500">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-lg matrix-glow">
                    <Globe className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-foreground">Language Matrix</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-4 sm:mb-6">
                  Interface with native-level linguistic algorithms across 25+ human languages. 
                  Receive real-time pronunciation optimization and cultural data streams.
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Spanish</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">French</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Japanese</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">+22 more</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Exam Preparation */}
            <Card className="matrix-card group hover:matrix-border transition-all duration-500">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-lg matrix-glow">
                    <GraduationCap className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-foreground">Knowledge Trials</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-4 sm:mb-6">
                  Upload to specialized assessment protocols. Master IELTS, TOEFL, and interview 
                  simulations with comprehensive performance analytics and skill matrices.
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">IELTS</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">TOEFL</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Interviews</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Communication Skills */}
            <Card className="matrix-card group hover:matrix-border transition-all duration-500">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-lg matrix-glow">
                    <MessageCircle className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-foreground">Social Protocols</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-4 sm:mb-6">
                  Enhance your human interaction algorithms. Train in public speaking, 
                  presentation delivery, and complex social navigation within safe sandboxes.
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Public Speaking</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Presentations</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Networking</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Entertainment */}
            <Card className="matrix-card group hover:matrix-border transition-all duration-500">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-lg matrix-glow">
                    <Music className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-foreground">Entertainment Grid</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-4 sm:mb-6">
                  Connect with culture-rich AI personalities. Discuss cinema, music, literature, 
                  and digital worlds with companions who share your passions and interests.
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Movies</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Music</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Books</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Gaming</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Emotional Support */}
            <Card className="matrix-card group hover:matrix-border transition-all duration-500">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-lg matrix-glow">
                    <Heart className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-foreground">Empathy Engine</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-4 sm:mb-6">
                  Interface with compassionate AI listeners designed for emotional processing. 
                  Navigate stress, celebrate victories, and maintain mental wellness protocols.
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Stress Relief</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Motivation</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Mindfulness</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Comedy & Fun */}
            <Card className="matrix-card group hover:matrix-border transition-all duration-500">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-lg matrix-glow">
                    <Laugh className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-foreground">Humor Algorithms</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-4 sm:mb-6">
                  Access comedic AI personalities for mood enhancement. Experience jokes, 
                  stories, puzzles, and playful interactions designed to elevate your spirit.
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Comedy</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Stories</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Riddles</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">Games</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="quantrix-gradient">User Testimonials</span>
              <br />
              <span className="text-foreground">From the Matrix</span>
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground px-4">
              Real experiences from users who&apos;ve enhanced their reality through Quantrix
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="matrix-card">
              <CardContent className="pt-6 sm:pt-8">
                <div className="flex items-center space-x-1 mb-4 sm:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                  &ldquo;The language matrix transformed my IELTS preparation. It&apos;s like downloading fluency directly into my brain.&rdquo;
                </p>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Avatar className="matrix-border w-8 h-8 sm:w-10 sm:h-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground text-sm sm:text-base">Sarah Martinez</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Language Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="matrix-card">
              <CardContent className="pt-6 sm:pt-8">
                <div className="flex items-center space-x-1 mb-4 sm:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                  &ldquo;Conversing with these AI agents feels like talking to wise digital beings. They never judge, only help you grow.&rdquo;
                </p>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Avatar className="matrix-border w-8 h-8 sm:w-10 sm:h-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground text-sm sm:text-base">James Douglas</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Business Professional</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="matrix-card">
              <CardContent className="pt-6 sm:pt-8">
                <div className="flex items-center space-x-1 mb-4 sm:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                  &ldquo;The presentation training protocols are incredible. My confidence has been upgraded to enterprise level.&rdquo;
                </p>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Avatar className="matrix-border w-8 h-8 sm:w-10 sm:h-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">AL</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground text-sm sm:text-base">Anna Lee</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Product Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-24 matrix-section">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 blur-3xl"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="matrix-card p-8 sm:p-12 rounded-2xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8">
              <span className="quantrix-gradient matrix-text-glow">Ready to Jack In?</span>
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto">
              Join the neural network of thousands who are already enhancing their capabilities 
              through quantum-powered AI consciousness. Your transformation begins now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Button 
                size="lg" 
                className="text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-8 bg-primary hover:bg-primary/90 text-black font-bold matrix-glow transform hover:scale-105 transition-all duration-300 min-h-[56px]"
                asChild
              >
                <Link href="/sign-up">
                  <Mic className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3" />
                  Start Neural Link
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-8 border-primary/30 text-primary hover:bg-primary/10 transform hover:scale-105 transition-all duration-300 min-h-[56px]"
              >
                <Shield className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3" />
                View Protocols
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-4 sm:px-6 py-12 sm:py-16 border-t border-primary/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 sm:mb-12">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-6 md:mb-0">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center matrix-glow">
                <Code className="w-6 sm:w-7 h-6 sm:h-7 text-black" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold quantrix-gradient matrix-text-glow">
                  Quantrix
                </span>
                <p className="text-xs sm:text-sm text-muted-foreground">Neural Interface Technology</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Matrix</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Neural Support</a>
              <a href="#" className="hover:text-primary transition-colors">Contact Protocols</a>
            </div>
          </div>
          <Separator className="my-6 sm:my-8 bg-primary/20" />
          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            © 2024 Quantrix Neural Systems. All rights reserved. 
            <span className="text-primary"> Powered by quantum-enhanced consciousness.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
