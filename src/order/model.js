const { Schema, model } = require('mongoose');

const OrderSchema = new Schema({
    details: [{
        _id : false,
        product: {
            type: Schema.ObjectId,
            ref: 'Product',
            required: true
        },
        priceOnDate: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        },
    }],
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Order', OrderSchema);