export const getActivationEmailHTML = (fullName, activationLink) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:20px;">
    <table style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.06);">
      <tr>
        <td style="background:#FFB900;padding:20px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:20px;">Worldpedia Education</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:28px;color:#333;">
          <p style="margin:0 0 12px 0;">Halo <strong>${fullName}</strong>,</p>
          <p style="margin:0 0 18px 0;">Terima kasih telah mendaftar. Klik tombol di bawah ini untuk mengaktifkan akun Anda:</p>
          <p style="text-align:center;margin:24px 0;">
            <a href="${activationLink}" target="_blank" style="background:#FFB900;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
              Aktivasi Akun
            </a>
          </p>
          <p style="margin:18px 0 0 0;color:#666;font-size:14px;">Jika tombol tidak berfungsi, salin dan tempel link ini di browser Anda:</p>
          <p style="word-break:break-all;color:#555;font-size:13px;">${activationLink}</p>
        </td>
      </tr>
      <tr>
        <td style="background:#f0f2f7;padding:16px;text-align:center;color:#888;font-size:12px;">
          &copy; ${new Date().getFullYear()} Worldpedia Education. All rights reserved.
        </td>
      </tr>
    </table>
  </div>
  `;
};

export const getResetPasswordEmailHTML = (fullName, resetLink) => {
  return `
    <div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:20px;">
      <table style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
        <tr><td style="padding:20px;text-align:center;background:#FFB900;color:#fff;"><h2>Reset Password</h2></td></tr>
        <tr><td style="padding:20px;color:#333;">
          <p>Hai <strong>${fullName}</strong>,</p>
          <p>Kami menerima permintaan reset password. Klik tombol di bawah untuk membuat password baru:</p>
          <p style="text-align:center;">
            <a href="${resetLink}" style="background:#FFB900;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Reset Password</a>
          </p>
          <p style="color:#666;font-size:13px;margin-top:12px;">Jika bukan Anda yang meminta, abaikan email ini.</p>
        </td></tr>
        <tr><td style="background:#f0f2f7;padding:12px;text-align:center;color:#888;">&copy; ${new Date().getFullYear()} Worldpedia Education</td></tr>
      </table>
    </div>
  `;
};
