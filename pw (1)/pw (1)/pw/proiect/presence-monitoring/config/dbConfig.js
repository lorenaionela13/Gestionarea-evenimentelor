const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = 'mongodb://localhost:27017/presence-monitoring';  
        await mongoose.connect(mongoURI);  
        console.log('Conexiunea la MongoDB a fost realizată cu succes!');
    } catch (error) {
        console.error(`Eroare la conectarea la MongoDB: ${error.message}`);
        process.exit(1);
    }
};



module.exports = connectDB;

