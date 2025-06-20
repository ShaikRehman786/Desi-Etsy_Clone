const mongoose  =require('mongoose');
const razorpay = require('../config/razorpay');

const orderSchema = new mongoose.Schema({
    customer:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},

    items:[
        {
            product:{type:mongoose.Schema.Types.ObjectId, ref:'Product', required:true},
            qty:{type:Number, required:true, min:1},
            price:{type:Number, required:true},
            artisan:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
        }
    ],
    subtotal:{type:Number, required:true},
    razorpay:{
        order_id:String, 
        payment_id:String,
        signature:String,
    },
    status:{
        type:String,
        enum:['Created', 'Paid', 'Packed', 'Shipped', 'Delivered'],
        default:'Created'
    }
},
{timestamps:true}
);

module.exports = mongoose.model('Order', orderSchema);

