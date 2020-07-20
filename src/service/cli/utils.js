'use strict';

const {getRandomInt, shuffle} = require(`../../utils`);

const DescriptionRestrict = {
  MIN: 1,
  MAX: 5,
};

const CategoryRestrict = {
  MIN: 1,
};

const CommentTextRestrict = {
  MIN: 1,
  MAX: 3,
};

exports.createOfferDescription = (sentences) => shuffle(sentences).slice(0, getRandomInt(DescriptionRestrict.MIN, DescriptionRestrict.MAX)).join(` `);

exports.createOfferCategories = (categories) => shuffle(categories).slice(0, getRandomInt(CategoryRestrict.MIN, categories.length));

exports.createCommentMessage = (comments) => shuffle(comments).slice(0, getRandomInt(CommentTextRestrict.MIN, CommentTextRestrict.MAX)).join(` `);
