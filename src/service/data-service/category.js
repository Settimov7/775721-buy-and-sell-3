`use strict`;

class CategoryService {
  findAll(offers) {
    const categories = offers.reduce((categories, {category}) => categories.add(...category), new Set());

    return [...categories];
  };
}

exports.CategoryService = CategoryService;
