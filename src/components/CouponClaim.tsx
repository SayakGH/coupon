'use client';

import React, { useState } from 'react';
import StatusMessage from './StatusMessage';

interface CouponResponse {
  success: boolean;
  message: string;
  coupon?: {
    code: string;
    description: string;
  };
  remainingTime?: number;
}

const CouponClaim: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CouponResponse | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const claimCoupon = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/coupons', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data: CouponResponse = await response.json();
      setResult(data);
      
      // Start countdown if there's a cooldown period
      if (!data.success && data.remainingTime) {
        setCountdown(Math.floor(data.remainingTime / 1000));
        const interval = setInterval(() => {
          setCountdown(prev => {
            if (prev === null || prev <= 1) {
              clearInterval(interval);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
        console.error(error);
      setResult({
        success: false,
        message: 'Failed to connect to the server. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${secs}s`;
  };

  return (
    <div>
      {result && (
        <StatusMessage 
          type={result.success ? 'success' : 'error'} 
          message={
            result.success 
              ? `${result.message} Your coupon code is: ${result.coupon?.code}`
              : result.message
          } 
        />
      )}
      
      {countdown !== null && (
        <div className="text-center mb-4 text-gray-600">
          Time remaining: {formatTime(countdown)}
        </div>
      )}
      
      <button
        onClick={claimCoupon}
        disabled={isLoading || countdown !== null}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
      >
        {isLoading ? 'Processing...' : 'Claim Coupon'}
      </button>
      
      {result?.success && result.coupon && (
        <div className="mt-4 p-4 bg-gray-50 rounded border text-black">
          <h2 className="font-semibold mb-2">Coupon Details:</h2>
          <p><strong>Code:</strong> {result.coupon.code}</p>
          <p><strong>Description:</strong> {result.coupon.description}</p>
        </div>
      )}
    </div>
  );
};

export default CouponClaim;

