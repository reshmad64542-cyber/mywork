import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '../../lib/database';
import { sendPasswordResetEmail } from '../../lib/email';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const [users] = await db.execute('SELECT id, email FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'If an account exists, a reset link has been sent' 
      });
    }

    const user = users[0];
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset link sent to your email' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to send reset email' 
    }, { status: 500 });
  }
}