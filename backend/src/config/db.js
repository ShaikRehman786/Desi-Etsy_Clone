const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log('Connected to MongoDB')
    }catch(error){
        console.log('Failed to Connect MongoDB!')
        process.exit(1);
    }
};

module.exports = connectDB;