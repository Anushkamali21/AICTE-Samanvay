import memoryStore, { initialUsers } from '../services/memoryStore.js';
import { generateToken } from '../middleware/auth.js';
import { requestOtp as sendOtp, verifyOtp as checkOtp } from '../services/otpService.js';
import { ROLES } from '../config/constants.js';

export const requestOtp = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Email address or mobile number is required.'
      });
    }

    const result = await sendOtp(identifier);
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully. For demonstration evaluation, demo code 123456 is also valid.',
      demoCode: result.demoCode
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { identifier, otp, role = ROLES.STUDENT, name, institution } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Identifier and 6-digit OTP are required.'
      });
    }

    // Verify OTP
    await checkOtp(identifier, otp);

    // Look up existing user
    let user = memoryStore.findUserByEmail(identifier);
    if (!user) {
      // Find by mobile
      user = memoryStore.users.find(u => u.mobile === identifier);
    }

    // If new user, create profile
    if (!user) {
      const isEmail = identifier.includes('@');
      user = memoryStore.createUser({
        name: name || (isEmail ? identifier.split('@')[0] : 'Institutional User'),
        email: isEmail ? identifier : `${identifier}@samanvay.demo`,
        mobile: isEmail ? '9876543200' : identifier,
        role: role,
        institution: institution || 'Delhi Technological University',
        institutionId: 'DTU-001',
        department: 'General Administration',
        accountStatus: 'active'
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      token,
      user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Quick evaluator login to switch between roles during hackathon demonstration
export const demoLogin = async (req, res, next) => {
  try {
    const { role } = req.body;
    const matchedUser = initialUsers.find(u => u.role === role) || initialUsers[0];
    const token = generateToken(matchedUser);

    return res.status(200).json({
      success: true,
      message: `Signed in as demonstration ${matchedUser.role}.`,
      token,
      user: matchedUser
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};
