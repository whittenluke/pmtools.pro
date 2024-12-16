import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'PMTools <noreply@pmtools.pro>';

export const emailService = {
  async sendPasswordReset(email: string, resetLink: string) {
    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Reset your PMTools password',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0f172a;">Reset Your Password</h1>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${resetLink}" style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
            <p style="color: #64748b; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
            <p style="color: #64748b;">This link will expire in 1 hour for security reasons.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 14px;">PMTools - Professional Project Management</p>
          </div>
        `,
      });

      if (error) throw error;
      console.log('Password reset email sent:', data);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  },

  async sendVerification(email: string, verifyLink: string) {
    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Welcome to PMTools - Verify your email',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0f172a;">Welcome to PMTools!</h1>
            <p>Thank you for signing up. Please verify your email address to get started:</p>
            <a href="${verifyLink}" style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Verify Email</a>
            <p style="color: #64748b;">This link will expire in 24 hours.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 14px;">PMTools - Professional Project Management</p>
          </div>
        `,
      });

      if (error) throw error;
      console.log('Verification email sent:', data);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw error;
    }
  },
}; 