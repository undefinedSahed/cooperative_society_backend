export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'DO_NOT_USE_THIS_VALUE_IN_PRODUCTION',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});
