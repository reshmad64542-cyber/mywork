import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../../lib/database';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ success: false, message: 'Token and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'password_reset') {
      return NextResponse.json({ success: false, message: 'Invalid token type' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, decoded.userId]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset successfully' 
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ 
        success: false, 
        message: 'Reset link has expired' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Invalid or expired reset token' 
    }, { status: 400 });
  }
}