const Joi = require("joi");

const signUpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
  firstName: Joi.string().required().messages({
    "string.empty": "Name is required",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "Last Name is required",
  }),
  dateOfBirth: Joi.date().required().messages({
    "date.empty": "Birth date required",
  }),
  profileImageUrl: Joi.string().optional(),

  subscriptionPlan: Joi.object({
    planName: Joi.string().required().messages({
      "string.empty": "Plan name date required",
    }),
    startDate: Joi.date().required().messages({
      "date.empty": "Start date required",
    }),
    expiryDate: Joi.date().required().messages({
      "date.empty": "Expiry date required",
    }),
    autoRenew: Joi.boolean().required().messages({
      "boolean.empty": "Auto renew required",
    }),
  })
    .default({
      planName: "new_customer",
      startDate: new Date(),
      expiryDate: new Date(),
      autoRenew: true,
    })
    .optional(),

  watchHistory: Joi.array()
    .items(
      Joi.object({
        movieId: Joi.string().required().messages({
          "string.empty": "Movie id required",
        }),
        watchedAt: Joi.date().required().messages({
          "date.empty": "Watched at date required",
        }),
        progress: Joi.number().required().messages({
          "number.empty": "Progress required",
        }),
      })
    )
    .optional(),

  //stores movie ids
  favorites: Joi.array()
    .items(
      Joi.string().required().messages({
        "string.empty": "Favorite movie id required",
      })
    )
    .optional(),

  roles: Joi.array()
    .items(
      Joi.string().required().messages({
        "string.empty": "Roles required",
      })
    )
    .default(["user"])
    .required(),

  settings: Joi.object({
    language: Joi.string().required().default("en").messages({
      "string.empty": "Language required",
    }),
    preferredGenres: Joi.string().optional(),
    notification: Joi.object({
      email: Joi.boolean().default(false),
      sms: Joi.boolean().default(false),
      push: Joi.boolean().default(false),
    }),
  }),
}).required();

const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
}).required();

module.exports = { signUpSchema, signInSchema };
