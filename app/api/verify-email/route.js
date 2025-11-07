import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '../../lib/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ success: false, message: 'Verification token is required' }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await db.execute(
      'UPDATE users SET email_verified = 1, email_verified_at = NOW() WHERE id = ?',
      [decoded.userId]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully' 
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ 
        success: false, 
        message: 'Verification link has expired' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Invalid verification token' 
    }, { status: 400 });
  }
}