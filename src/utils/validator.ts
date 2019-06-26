export default {
  userSchema: {
    type: 'object',
    required: ['username', 'password', 'email'],
    properties: {
      username: { type: 'string' },
      password: {
        type: 'string',
        pattern: '^[a-zA-Z]\\w{3,20}$'
      },
      email: { type: 'string', format: 'email' }
    }
  },
  log: {
    password: `should match a letter, it must contain at least 4 characters and no more than 15 characters and no characters other than letters, numbers and the underscore may be used`
  }
};
