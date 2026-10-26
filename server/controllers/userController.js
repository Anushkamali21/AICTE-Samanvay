import memoryStore from '../services/memoryStore.js';

export const updateProfile = async (req, res, next) => {
  try {
    const { mobile, department } = req.body;
    
    // Explicitly disallow role or permission tampering
    if (req.body.role || req.body.accountStatus) {
      return res.status(403).json({
        success: false,
        message: 'Security violation: Role and account status cannot be modified through profile settings.'
      });
    }

    const updates = {};
    if (mobile) updates.mobile = mobile.trim();
    if (department) updates.department = department.trim();

    const updatedUser = memoryStore.updateUser(req.user._id, updates);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};
