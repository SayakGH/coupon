import CouponClaim from '@/components/CouponClaim';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Coupon Distribution System</h1>
        <p className="mb-6 text-gray-600">
          Welcome! Click the button below to claim your coupon. Please note that you can only claim one coupon per hour.
        </p>
        <CouponClaim />
      </div>
    </main>
  );
}

// -