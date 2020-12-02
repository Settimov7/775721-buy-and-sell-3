'use strict';

class OfferService {
  constructor(dataBase, logger) {
    const {sequelize, models} = dataBase;
    const {Category} = models;

    this._dataBase = dataBase;
    this._models = models;
    this._logger = logger;
    this._selectOptions = {
      raw: true,
      include: {
        model: Category,
        attributes: [],
        through: {
          attributes: [],
        },
      },
      attributes: [
        `id`,
        `title`,
        [`image`, `picture`],
        `sum`,
        `type`,
        `description`,
        [sequelize.fn(`ARRAY_AGG`, sequelize.col(`categories.title`)), `category`],
      ],
      group: [`offer.id`, `offer.title`, `offer.image`, `offer.sum`, `offer.type`, `offer.description`],
      order: [
        [`created_date`, `DESC`],
      ],
    };
  }

  async findAll({offset, limit}) {
    const {Offer} = this._models;

    try {
      const [quantity, offers] = await Promise.all([
        Offer.count(),
        Offer.findAll({
          ...this._selectOptions,
          offset,
          limit,
          subQuery: false,
        }),
      ]);

      return {
        offers,
        quantity,
      };
    } catch (error) {
      this._logger.error(`Can't findAll offers. Error: ${ error }`);

      return [];
    }
  }

  async create({categories: categoriesIds, description, picture, title, type, sum, userId}) {
    const {sequelize} = this._dataBase;
    const {Offer, Category, User} = this._models;

    try {
      const user = await User.findByPk(userId);

      const newOffer = await user.createOffer({
        title,
        image: picture,
        sum,
        type,
        description,
      });

      const categories = await Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        },
      });

      await newOffer.addCategories(categories);

      return await Offer.findByPk(newOffer.id, this._selectOptions);
    } catch (error) {
      this._logger.error(`Can't create offer. Error: ${ error }`);

      return null;
    }
  }

  async isExists(id) {
    const {Offer} = this._models;
    const offerId = Number.parseInt(id, 10);

    try {
      const offer = await Offer.findByPk(offerId);

      return !!offer;
    } catch (error) {
      this._logger.error(`Can't check existence of offer. Error: ${ error }`);

      return false;
    }
  }

  async findById(id) {
    const {Offer} = this._models;
    const offerId = Number.parseInt(id, 10);

    try {
      return await Offer.findByPk(offerId, this._selectOptions);
    } catch (error) {
      this._logger.error(`Can't find offer. Error: ${ error }`);

      return null;
    }
  }

  async update({id, category: categoriesIds, description, picture, title, type, sum}) {
    const {sequelize} = this._dataBase;
    const {Offer, Category} = this._models;

    try {
      const [updatedRows] = await Offer.update({
        title,
        image: picture,
        sum,
        type,
        description,
      }, {
        where: {
          id,
        },
      });

      if (!updatedRows) {
        return null;
      }

      const updatedOffer = await Offer.findByPk(id);

      const categories = await Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        },
      });

      await updatedOffer.setCategories(categories);

      return await Offer.findByPk(updatedOffer.id, this._selectOptions);
    } catch (error) {
      this._logger.error(`Can't update offer. Error: ${ error }`);

      return null;
    }
  }

  async delete(id) {
    const {Offer} = this._models;

    try {
      const deletedOffer = await Offer.findByPk(id, this._selectOptions);
      const deletedRows = await Offer.destroy({
        returning: true,
        where: {
          id,
        },
        ...this._selectOptions,
      });

      if (!deletedRows) {
        return null;
      }

      return deletedOffer;
    } catch (error) {
      this._logger.error(`Can't delete offer. Error: ${ error }`);

      return null;
    }
  }

  async findAllByTitle(title) {
    const {sequelize} = this._dataBase;
    const {Offer} = this._models;

    try {
      return await Offer.findAll({
        ...this._selectOptions,
        where: {
          title: {
            [sequelize.Sequelize.Op.iLike]: `%${ title }%`, // TODO: Не работает со строками на русском. Разобраться
          },
        },
      });
    } catch (error) {
      this._logger.error(`Can't find offers with title: ${ title }. Error: ${ error }`);

      return null;
    }
  }

  async isOfferBelongToUser(offerId, userId) {
    const {Offer} = this._models;

    try {
      const offer = await Offer.findByPk(offerId, {
        raw: true,
        attributes: [
          `id`,
          [`user_id`, `userId`],
        ],
      });

      return offer.userId === userId;
    } catch (error) {
      this._logger.error(`Can't check whom offer belongs. Error: ${ error }`);

      return false;
    }
  }
}

exports.OfferService = OfferService;
