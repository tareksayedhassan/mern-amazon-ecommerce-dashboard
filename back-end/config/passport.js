const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const SocialUsers = require("../models/SocialUsers.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/oauth",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        };

        let user = await SocialUsers.findOne({ googleId: profile.id });
        if (!user) {
          user = await SocialUsers.create(userData);
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// serializeUser و deserializeUser لازم يكونوا هنا
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await SocialUsers.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
