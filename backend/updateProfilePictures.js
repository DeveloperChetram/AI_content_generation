const mongoose = require('mongoose');
const userModel = require('./src/models/user.model');

// Replace with your MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/your-database-name'; // Update this with your actual connection string

const updateProfilePictures = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all users that don't have a profilePicture field
    const result = await userModel.updateMany(
      { profilePicture: { $exists: false } },
      { 
        $set: { 
          profilePicture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR18nPHhhTTfFH-nSyo21XUTlBg-ZdUPXkqjTMU7o4dn8LtXozDY-YqH1k7M7Cx8GqeETk&usqp=CAU" 
        } 
      }
    );

    console.log(`Updated ${result.modifiedCount} user documents`);
    console.log(`Matched ${result.matchedCount} user documents`);

    // If you want to update ALL users (even those who already have a profilePicture):
    // const result2 = await userModel.updateMany(
    //   {},
    //   { 
    //     $set: { 
    //       profilePicture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR18nPHhhTTfFH-nSyo21XUTlBg-ZdUPXkqjTMU7o4dn8LtXozDY-YqH1k7M7Cx8GqeETk&usqp=CAU" 
    //     } 
    //   }
    // );

  } catch (error) {
    console.error('Error updating profile pictures:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the update
updateProfilePictures();
