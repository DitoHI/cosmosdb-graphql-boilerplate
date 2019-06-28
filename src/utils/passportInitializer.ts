import * as passportJWT from 'passport-jwt';

const strategyInitializer = (userController: any) => {
  const { Strategy, ExtractJwt } = passportJWT;

  const params = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.APP_SECRET
  };

  return new Strategy(params, async (payload, done) => {
    const users = await userController.showUsers({ id: payload.id });

    return done(null, users[0]);
  });
};

export default strategyInitializer;
