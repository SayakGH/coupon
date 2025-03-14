import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

// Set the cooldown period (in milliseconds)
const COOLDOWN_PERIOD = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  try {
    // Get the client's IP address
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      '127.0.0.1';
    
    // Get or set a cookie for the user
    const cookieStore = await cookies();
    let cookieId = cookieStore.get('coupon_user_id')?.value;
    
    if (!cookieId) {
      cookieId = uuidv4();
      // This will be set in the response
    }
    
    // Get user agent
    const userAgent = request.headers.get('user-agent') || '';
    
    // Connect to the database
    const client = await clientPromise;
    const db = client.db('coupon-system');
    
    // Check if the user has claimed recently (based on IP or cookie)
    const recentClaim = await db.collection('claims').findOne({
      $or: [
        { ipAddress, claimedAt: { $gt: new Date(Date.now() - COOLDOWN_PERIOD) } },
        { cookieId, claimedAt: { $gt: new Date(Date.now() - COOLDOWN_PERIOD) } }
      ]
    });
    
    if (recentClaim) {
      // Calculate remaining time
      const timeElapsed = Date.now() - recentClaim.claimedAt.getTime();
      const timeRemaining = Math.ceil((COOLDOWN_PERIOD - timeElapsed) / (60 * 1000)); // in minutes
      
      const response = NextResponse.json({
        success: false,
        message: `Please wait ${timeRemaining} minutes before claiming another coupon.`,
        remainingTime: COOLDOWN_PERIOD - timeElapsed
      }, { status: 429 });
      
      // Set or refresh the cookie
      response.cookies.set('coupon_user_id', cookieId, { 
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 // 30 days
      });
      
      return response;
    }
    
    // Get the next available coupon using round-robin approach
    const lastClaim = await db.collection('claims')
      .find()
      .sort({ claimedAt: -1 })
      .limit(1)
      .toArray();
    
    // Get all active coupons
    const coupons = await db.collection('coupons')
      .find({ active: true })
      .toArray();
    
    if (coupons.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No coupons available at this time.'
      }, { status: 404 });
    }
    
    // Determine which coupon to assign next
    let nextCouponIndex = 0;
    if (lastClaim.length > 0) {
      // Find the index of the last claimed coupon
      const lastCouponId = lastClaim[0].couponId;
      const lastIndex = coupons.findIndex(c => c._id.toString() === lastCouponId.toString());
      
      // Choose the next coupon in the sequence
      nextCouponIndex = (lastIndex + 1) % coupons.length;
    }
    
    const coupon = coupons[nextCouponIndex];
    
    // Record the claim
    await db.collection('claims').insertOne({
      couponId: coupon._id,
      ipAddress,
      userAgent,
      cookieId,
      claimedAt: new Date()
    });
    
    // Create and send the response
    const response = NextResponse.json({
      success: true,
      message: 'Coupon claimed successfully!',
      coupon: {
        code: coupon.code,
        description: coupon.description
      }
    });
    
    // Set or refresh the cookie
    response.cookies.set('coupon_user_id', cookieId, { 
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    
    return response;
    
  } catch (error) {
    console.error('Error claiming coupon:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while claiming the coupon.'
    }, { status: 500 });
  }
}
