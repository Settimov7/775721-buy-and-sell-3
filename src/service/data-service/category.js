'use strict';

class CategoryService {
  constructor(dataBase, logger) {
    this._dataBase = dataBase;
    this._models = dataBase.models;
    this._logger = logger;
    this._selectOptions = {
      raw: true,
    };
  }

  async findAll() {
    const {Category} = this._models;

    try {
      return await Category.findAll(this._selectOptions);
    } catch (error) {
      this._logger.error(`Can't find categories. Error: ${ error }`);

      return null;
    }
  }
}

exports.CategoryService = CategoryService;
