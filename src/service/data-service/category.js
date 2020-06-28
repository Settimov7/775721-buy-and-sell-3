'use strict';

class CategoryService {
  findAll(offers) {
    const categories = offers.reduce((acc, {category}) => new Set([...acc, ...category]), new Set());

    return [...categories];
  }
}

exports.CategoryService = CategoryService;
