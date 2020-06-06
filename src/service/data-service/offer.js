`use strict`;

const {nanoid} = require(`nanoid`);

const {MAX_ID_LENGTH} = require(`../../constants`);

class OfferService {
  #offers;

  constructor(offers) {
    this.#offers = offers;
  }

  findAll() {
    return this.#offers;
  };

  create({category, description, picture, title, type, sum}) {
    const newOffer = {
      id: nanoid(MAX_ID_LENGTH),
      category,
      description,
      picture,
      title,
      type,
      sum,
      comments: [],
    };

    this.#offers.push(newOffer);

    return newOffer;
  };

  isExists(id) {
    return this.#offers.some((offer) => offer.id === id);
  };

  findById(id) {
    return this.#offers.find((offer) => offer.id === id);
  }

  update({id, category, description, picture, title, type, sum}) {
    const offerIndex = this.#offers.findIndex((offer) => offer.id === id);

    if (offerIndex === -1) {
      return null;
    }

    const offer = this.#offers[offerIndex];
    const updatedOffer = Object.assign(offer, {category, description, picture, title, type, sum});

    this.#offers[offerIndex] = updatedOffer;

    return updatedOffer;
  };

  delete(id) {
    const deletedOffer = this.findById(id);

    if (!deletedOffer) {
      return null;
    }

    this.#offers = this.#offers.filter((offer) => offer.id !== id);

    return deletedOffer;
  }

  findAllCategories() {
    const categories = this.#offers.reduce((categories, {category}) => categories.add(...category), new Set());

    return [...categories];
  };

  findAllByTitle(title) {
    return this.#offers.filter((offer) => offer.title.includes(title));
  };
}

exports.OfferService = OfferService;
