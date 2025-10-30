import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PaymentSetup() {
  const [loading, setLoading] = useState(false);
  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

  if (!stripePublicKey) {
    return (
      <Card className="p-6 bg-yellow-900/20 border-yellow-600">
        <h3 className="text-lg font-bold text-yellow-400 mb-2">Stripe Configuration Pending</h3>
        <p className="text-yellow-200 text-sm">Payment processing is being set up. Please try again later.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">Payment Method</h3>
      <p className="text-gray-400 mb-4">Add or manage your payment methods</p>
      <Button disabled={loading} className="bg-orange-600 hover:bg-orange-700">
        {loading ? "Loading..." : "Add Payment Method"}
      </Button>
    </Card>
  );
}
