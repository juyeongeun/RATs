import passport from "passport";
import {
  accessTokenStrategy,
  refreshTokenStrategy,
} from "../middleware/passport/jwtToken";

passport.use("access-token", accessTokenStrategy);
passport.use("refresh-token", refreshTokenStrategy);

export default passport;
