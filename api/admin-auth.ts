import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pin } = req.body || {};
    if (!pin || typeof pin !== 'string') {
      return res.status(400).json({ error: 'PIN is required' });
    }

    // Secure server-side check (environment variable or default supervisor key)
    const validPins = [
      'Ba#6i6',
      'ba#6i6',
      'BA#6I6',
      process.env.ADMIN_PIN,
      '9696'
    ].filter(Boolean);

    const isMatch = validPins.includes(pin.trim());

    if (isMatch) {
      // Generate a session auth token
      const sessionToken = 'adm_' + Buffer.from(Date.now() + '_' + Math.random()).toString('base64');
      return res.status(200).json({
        success: true,
        sessionToken
      });
    }

    return res.status(401).json({
      success: false,
      error: 'رمز المرور غير صحيح'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'خطأ في التحقق'
    });
  }
}
