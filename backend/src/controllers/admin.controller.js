const User = require('../models/user.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');


// GET /api/admin/overview
exports.overview = async (_, res) => {
    const [users, products, orders] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
    ]);
    res.json({users, products, orders});
};



// Artisan Verification

// list of artisans pending
exports.listArtisanPending = async(_, res) => {
    const pending = await User.find({role:'Artisan',isApproved:false})
        .select('-password');
    res.json(pending);
};


// approving artisans
exports.approveArtisan = async(req, res) => {
    const art = await User.findByIdAndUpdate(
        req.params.id,
        {isApproved:true},
        {new:true}
    ).select('-password');
    if (!art) return res.status(404).json({message:'Not found'});
    res.json(art);
};



// rejecting artisan
exports.rejectArtisan = async(req, res)=>{
    await User.findByIdAndDelete(req.params.id);
    res.json({message:'Artisan rejected & deleted'});
};

