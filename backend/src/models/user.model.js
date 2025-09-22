const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    aiCredits: {
      type: Number,
      default: 50,
    },
    aiImageCredits: {
      type: Number,
      default: 0,
    },
    // posts: [
    //   {
    //     _id: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "posts",
    //     },
    //     title: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    bio:{
      required:false,
      type: String,
      default: "Hey dude, I'm user of wrAIte",
    },
    profilePicture:{
      required:false,
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR18nPHhhTTfFH-nSyo21XUTlBg-ZdUPXkqjTMU7o4dn8LtXozDY-YqH1k7M7Cx8GqeETk&usqp=CAU",
    },

  }, 
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
