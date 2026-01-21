import Joi from 'joi';

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        amenities: Joi.array().items(Joi.string()).default([]),
        coordinates: Joi.object({
            latitude: Joi.number().min(-90).max(90),
            longitude: Joi.number().min(-180).max(180)
        }).default({
            latitude: 20.5937,
            longitude: 78.9629
        })
    }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});

export { listingSchema, reviewSchema };
