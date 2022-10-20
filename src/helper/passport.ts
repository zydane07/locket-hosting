import { PassportStatic } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../repository/user.repository';

export const passportInit = (
  passport: PassportStatic,
  userRepository: UserRepository,
) => {
  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.VERIFY_KEY,
      },
      async (jwtPayload, done) => {
        try {
          const findUser = await userRepository.find({
            where: {
              email: jwtPayload.email,
            },
          });
          if (!findUser) {
            return done(null, false);
          }
          const user = {
            id: findUser.id,
            email: findUser.email,
            name: findUser.name,
            role_id: findUser.role_id,
          };
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      },
    ),
  );
};
