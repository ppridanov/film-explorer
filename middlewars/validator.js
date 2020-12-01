const { celebrate, Joi } = require('celebrate');
const {
  checkNameMsg,
  checkEmailMsg,
  checkPassMsg,
  checkDataMsg,
  checkLinkMsg,
  checkImageMsg,
} = require('../scripts/validator-msg');

module.exports.newUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .label(checkNameMsg),
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: false } })
      .label(checkEmailMsg),
    password: Joi.string()
      .required()
      .min(3)
      .pattern(/^[a-zA-Z0-9]{3,30}$/)
      .label(checkPassMsg),
  }),
});


module.exports.loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: false } })
      .label(checkEmailMsg),
    password: Joi.string()
      .required()
      .min(3)
      .pattern(/^[a-zA-Z0-9]{3,30}$/)
      .label(checkPassMsg),
  }),
});

module.exports.filmCreateValidator = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string()
      .required()
      .min(2)
      .max(30)
      .label(checkDataMsg),
    title: Joi.string()
      .required()
      .min(2)
      .max(30)
      .label(checkDataMsg),
    text: Joi.string()
      .required()
      .min(2)
      .max(30)
      .label(checkDataMsg),
    date: Joi.string()
      .required()
      .min(2)
      .max(30)
      .label(checkDataMsg),
    source: Joi.string()
      .required()
      .min(2)
      .max(30)
      .label(checkDataMsg),
    link: Joi.string()
      .required()
      .pattern(/^https?:\/\//)
      .label(checkLinkMsg),
    image: Joi.string()
      .required()
      .pattern(/^https?:\/\//)
      .label(checkImageMsg),
  }),
});
