import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, MessageSquare, Phone } from "lucide-react";

export default function Welcome() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Welcome to <span className="text-orange-500">ARAS AI</span>
          </h1>
          <p className="text-xl text-gray-400">The future of AI-powered sales automation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 border border-orange-500/20 rounded-lg p-6">
            <MessageSquare className="w-8 h-8 text-orange-500 mb-4" />
            <h3 className="text-white font-bold mb-2">AI Chat</h3>
            <p className="text-gray-400 text-sm">Get strategic sales advice instantly</p>
          </div>
          <div className="bg-gray-800/50 border border-orange-500/20 rounded-lg p-6">
            <Phone className="w-8 h-8 text-orange-500 mb-4" />
            <h3 className="text-white font-bold mb-2">Voice Calls</h3>
            <p className="text-gray-400 text-sm">Launch automated voice campaigns</p>
          </div>
          <div className="bg-gray-800/50 border border-orange-500/20 rounded-lg p-6">
            <Zap className="w-8 h-8 text-orange-500 mb-4" />
            <h3 className="text-white font-bold mb-2">Automation</h3>
            <p className="text-gray-400 text-sm">Streamline your entire sales process</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate("/space")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
