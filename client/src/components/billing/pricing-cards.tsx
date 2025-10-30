import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/js";

export function PricingCards() {
  const [loading, setLoading] = useState(false);
  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

  // GRACEFUL DEGRADATION - wenn Stripe nicht lädt, zeige Fallback
  if (!stripePublicKey || !stripePublicKey.startsWith('pk_')) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-gray-900 border border-orange-500/30 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Starter</h3>
          <p className="text-orange-500 text-2xl font-bold mb-6">$29/mo</p>
          <p className="text-gray-400">Coming soon...</p>
        </div>
        <div className="p-6 bg-gray-900 border border-orange-500/50 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Professional</h3>
          <p className="text-orange-500 text-2xl font-bold mb-6">$99/mo</p>
          <p className="text-gray-400">Coming soon...</p>
        </div>
        <div className="p-6 bg-gray-900 border border-orange-500/30 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Enterprise</h3>
          <p className="text-orange-500 text-2xl font-bold mb-6">$299/mo</p>
          <p className="text-gray-400">Coming soon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="p-6 bg-gray-900 border border-orange-500/30 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">Starter</h3>
        <p className="text-orange-500 text-2xl font-bold mb-6">$29/mo</p>
        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition">
          Subscribe
        </button>
      </div>
      <div className="p-6 bg-gray-900 border border-orange-500/50 rounded-lg border-2">
        <div className="bg-orange-600 text-white text-center py-1 px-2 rounded mb-3 text-sm font-bold">Popular</div>
        <h3 className="text-xl font-bold text-white mb-4">Professional</h3>
        <p className="text-orange-500 text-2xl font-bold mb-6">$99/mo</p>
        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition">
          Subscribe
        </button>
      </div>
      <div className="p-6 bg-gray-900 border border-orange-500/30 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">Enterprise</h3>
        <p className="text-orange-500 text-2xl font-bold mb-6">$299/mo</p>
        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition">
          Contact Sales
        </button>
      </div>
    </div>
  );
}
