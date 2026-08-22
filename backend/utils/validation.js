const validateRegistration = ({ name, email, password }) => {
  if (!name || !name.trim()) {
    return { valid: false, message: 'Name is required.' };
  }
  if (name.trim().length > 100) {
    return { valid: false, message: 'Name must be 100 characters or fewer.' };
  }

  if (!email || !email.trim()) {
    return { valid: false, message: 'Email is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }

  if (!password) {
    return { valid: false, message: 'Password is required.' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (password.length > 128) {
    return { valid: false, message: 'Password must be 128 characters or fewer.' };
  }

  return { valid: true };
};

const validateLogin = ({ email, password }) => {
  if (!email || !email.trim()) {
    return { valid: false, message: 'Email is required.' };
  }
  if (!password) {
    return { valid: false, message: 'Password is required.' };
  }
  return { valid: true };
};

module.exports = { validateRegistration, validateLogin };
