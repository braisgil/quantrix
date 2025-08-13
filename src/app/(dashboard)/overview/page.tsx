import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Code, Brain, Zap } from 'lucide-react';

const Page: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold quantrix-gradient matrix-text-glow">
            AI Agents
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your neural network companions
          </p>
        </div>
      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold matrix-glow">
          <Plus className="w-4 h-4 mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="matrix-card">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Active Agents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary matrix-text-glow">3</div>
            <p className="text-sm text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card className="matrix-card">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Neural Sessions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary matrix-text-glow">127</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="matrix-card">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Matrix Uptime</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary matrix-text-glow">99.9%</div>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Agents List */}
      <Card className="matrix-card">
        <CardHeader>
          <CardTitle className="text-xl">Your Neural Network</CardTitle>
          <CardDescription>
            AI agents ready to enhance your digital experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Agent 1 */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-primary/20 hover:matrix-border transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg matrix-glow">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Language Matrix</h3>
                <p className="text-sm text-muted-foreground">Spanish conversation specialist</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                Active
              </Badge>
              <Button size="sm" variant="outline" className="matrix-border hover:matrix-glow">
                Configure
              </Button>
            </div>
          </div>

          {/* Agent 2 */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-primary/20 hover:matrix-border transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg matrix-glow">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Code Assistant</h3>
                <p className="text-sm text-muted-foreground">Programming mentor and reviewer</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                Standby
              </Badge>
              <Button size="sm" variant="outline" className="matrix-border hover:matrix-glow">
                Configure
              </Button>
            </div>
          </div>

          {/* Agent 3 */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-primary/20 hover:matrix-border transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg matrix-glow">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Quantum Therapist</h3>
                <p className="text-sm text-muted-foreground">Emotional support and wellness</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                Active
              </Badge>
              <Button size="sm" variant="outline" className="matrix-border hover:matrix-glow">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
