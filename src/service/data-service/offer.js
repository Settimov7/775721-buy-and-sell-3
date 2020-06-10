'use strict';

const {nanoid} = require(`nanoid`);

const {MAX_ID_LENGTH} = require(`../../constants`);

class OfferService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    return this._offers;
  }

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

    this._offers.push(newOffer);

    return newOffer;
  }

  isExists(id) {
    return this._offers.some((offer) => offer.id === id);
  }

  findById(id) {
    return this._offers.find((offer) => offer.id === id);
  }

  update({id, category, description, picture, title, type, sum}) {
    const offerIndex = this._offers.findIndex((offer) => offer.id === id);

    if (offerIndex === -1) {
      return null;
    }

    const offer = this._offers[offerIndex];
    const updatedOffer = Object.assign(offer, {category, description, picture, title, type, sum});

    this._offers[offerIndex] = updatedOffer;

    return updatedOffer;
  }

  delete(id) {
    const deletedOffer = this.findById(id);

    if (!deletedOffer) {
      return null;
    }

    this._offers = this._offers.filter((offer) => offer.id !== id);

    return deletedOffer;
  }

  findAllByTitle(title) {
    return this._offers.filter((offer) => offer.title.includes(title));
  }
}

exports.OfferService = OfferService;
