const { User } = require('./../models');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/AppError');
const FacebookTokenStrategy = require('passport-facebook-token');
const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-plus-token');

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      profileFields: ['email', 'id', 'first_name', 'gender', 'last_name', 'picture'],
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(async function () {
        let name = profile.name.familyName + ' ' + profile.name.middleName + ' ' + profile.name.givenName;
        name.trim();
        for (let i = 0; i < name.length; i++) {
          name = name.replace('  ', ' ');
          i++;
        }
        let user = await User.findOne({ authFacebookId: profile.id });
        if (user) return done(null, user);
        else {
          try {
            const newUser = new User({
              authType: 'facebook',
              email: profile.emails[0].value,
              authFacebookId: profile.id,
              name: name,
              verifyEmail: true,
              avatar: profile.photos[0].value,
              password: process.env.PASSWORD_DEFAULT,
            });
            await newUser.save();
            done(null, newUser);
          } catch (error) {
            console.log(error);
          }
        }
      });
    }
  )
);

passport.use(
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done, next) {
      let user = await User.findOne({ authGoogleId: profile.id });
      if (user) return done(null, user);
      else {
        try {
          const newUser = new User({
            authType: 'google',
            email: profile.emails[0].value,
            authGoogleId: profile.id,
            name: profile.displayName,
            verifyEmail: true,
            avatar: profile.image.url,
            password: process.env.PASSWORD_DEFAULT,
          });
          await newUser.save();
          done(null, newUser);
        } catch (error) {
          console.log(error);
        }
      }
    }
  )
);
