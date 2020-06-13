'use strict';

class CategoryService {
  findAll(offers) {
    const categories = offers.reduce((acc, {category}) => acc.add(...category), new Set());

    return [...categories];
  }
}

exports.CategoryService = CategoryService;
