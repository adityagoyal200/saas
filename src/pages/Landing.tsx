import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Webhook, Zap, Lock, Clock } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Webhook className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">HookCatch</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Test Webhooks in Real-Time
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get instant webhook URLs. Receive, inspect, and debug HTTP requests in real-time. 
            Built for developers who move fast.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8">
                Start Testing Free
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border-border bg-card">
            <Webhook className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Permanent URLs</h3>
            <p className="text-muted-foreground text-sm">
              Each endpoint gets a unique, permanent URL that never changes
            </p>
          </Card>
          
          <Card className="p-6 border-border bg-card">
            <Zap className="h-10 w-10 text-secondary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Real-Time Updates</h3>
            <p className="text-muted-foreground text-sm">
              See incoming requests instantly with live updates
            </p>
          </Card>
          
          <Card className="p-6 border-border bg-card">
            <Lock className="h-10 w-10 text-success mb-4" />
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className="text-muted-foreground text-sm">
              Your data is encrypted and only accessible to you
            </p>
          </Card>
          
          <Card className="p-6 border-border bg-card">
            <Clock className="h-10 w-10 text-warning mb-4" />
            <h3 className="text-lg font-semibold mb-2">Request History</h3>
            <p className="text-muted-foreground text-sm">
              Keep the last 100 requests with detailed payload inspection
            </p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-2xl mx-auto border border-border rounded-lg p-12 bg-card">
          <h2 className="text-3xl font-bold mb-4">Ready to catch some hooks?</h2>
          <p className="text-muted-foreground mb-6">
            Join developers using HookCatch to test and debug webhooks faster
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8">
              Create Your First Endpoint
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 HookCatch. Built for developers, by developers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
