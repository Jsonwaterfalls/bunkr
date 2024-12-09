import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16 animate-fadeIn">
          <img 
            src="/lovable-uploads/bbbcc199-7eed-436a-864f-91dc9f0a1df4.png" 
            alt="BUNKr Logo" 
            className="h-16 md:h-20 mb-8"
          />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Truth Matters
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8">
            Verify statements, combat misinformation, and join a community dedicated to uncovering the truth.
          </p>
          <Link to="/app">
            <Button size="lg" className="text-lg">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">AI-Powered Verification</h3>
              <p className="text-muted-foreground">
                Advanced AI algorithms analyze statements in real-time to help determine their accuracy.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Community Insights</h3>
              <p className="text-muted-foreground">
                Join discussions and see what others think about trending topics and viral claims.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Share Findings</h3>
              <p className="text-muted-foreground">
                Easily share verified information with your network to help stop the spread of misinformation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Ready to uncover the truth?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already using BUNKr to verify information and make informed decisions.
          </p>
          <Link to="/app">
            <Button size="lg" variant="outline" className="text-lg">
              Start Verifying Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;