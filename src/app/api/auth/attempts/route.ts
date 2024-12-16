import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create rate limiter
const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '5 m'), // 5 attempts per 5 minutes
  analytics: true,
  prefix: '@upstash/ratelimit',
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { success, action } = await request.json();
    
    const key = `${ip}:${action}`; // action can be 'signin' or 'reset'
    
    // Get current attempts
    const attempts = await redis.get<number>(key) || 0;
    
    if (success) {
      // Reset attempts on successful auth
      await redis.del(key);
      return NextResponse.json({ requireCaptcha: false });
    } else {
      // Increment attempts
      await redis.set(key, attempts + 1);
      
      // Check rate limit
      const { success: allowed } = await authLimiter.limit(ip);
      if (!allowed) {
        return NextResponse.json(
          { error: 'Too many attempts. Please try again later.' },
          { status: 429 }
        );
      }
      
      // Require CAPTCHA after 3 failed attempts
      const requireCaptcha = attempts >= 3;
      
      return NextResponse.json({
        requireCaptcha,
        remainingAttempts: 3 - attempts,
      });
    }
  } catch (error) {
    console.error('Auth attempts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 