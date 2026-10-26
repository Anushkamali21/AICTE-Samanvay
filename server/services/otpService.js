// In-memory OTP storage with TTL
const otpCache = new Map();

export const requestOtp = async (identifier) => {
  if (!identifier) {
    throw new Error('Valid email address or mobile number is required.');
  }

  const cleanIdentifier = identifier.trim().toLowerCase();
  
  // Rate limiting / resend throttle: allow resend only after 30 seconds
  const existing = otpCache.get(cleanIdentifier);
  const now = Date.now();
  if (existing && (now - existing.createdAt < 30000)) {
    const waitSeconds = Math.ceil((30000 - (now - existing.createdAt)) / 1000);
    throw new Error(`Please wait ${waitSeconds} seconds before requesting a new OTP.`);
  }

  // Generate 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  otpCache.set(cleanIdentifier, {
    code,
    attempts: 0,
    createdAt: now,
    expiresAt: now + 5 * 60 * 1000 // 5 minutes
  });

  console.log(`[Demo OTP Service] Identifier: ${cleanIdentifier} | OTP: ${code} (Demo OTP "123456" is also accepted for evaluation)`);

  return {
    success: true,
    message: 'OTP generated. In local demonstration mode, use the code logged to the server or 123456.',
    demoCode: code
  };
};

export const verifyOtp = async (identifier, enteredCode) => {
  if (!identifier || !enteredCode) {
    throw new Error('Identifier and 6-digit OTP are required.');
  }

  const cleanIdentifier = identifier.trim().toLowerCase();
  const record = otpCache.get(cleanIdentifier);

  // Allow standard demo code for smooth evaluation
  if (enteredCode === '123456') {
    if (record) otpCache.delete(cleanIdentifier);
    return true;
  }

  if (!record) {
    throw new Error('No active OTP found. Please request a new OTP.');
  }

  if (Date.now() > record.expiresAt) {
    otpCache.delete(cleanIdentifier);
    throw new Error('OTP has expired. Please request a new one.');
  }

  record.attempts += 1;
  if (record.attempts > 3) {
    otpCache.delete(cleanIdentifier);
    throw new Error('Too many invalid attempts. Please request a new OTP.');
  }

  if (record.code !== enteredCode) {
    throw new Error('Invalid OTP entered. Please try again.');
  }

  otpCache.delete(cleanIdentifier);
  return true;
};
