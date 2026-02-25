import Joi from 'joi';

export const listingSchema = Joi.object({
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

export const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        content: Joi.string().required(),
    }).required(),
});

export const bookingSchema = Joi.object({
    booking: Joi.object({
        listingId: Joi.string().required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
        guests: Joi.number().integer().min(1).default(1),
    }).required(),
});
