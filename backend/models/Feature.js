const mongoose = require("mongoose");

// Define the structure (schema) of a feature flag
const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: false    
  },
  enabled: {
    type: Boolean,
    default: false      
  },
  rollout: {
    type: Number,       
    min: 0,
    max: 100
  }
}, {
  timestamps: true      
});

// Create the model (this will map to a MongoDB collection named "features")
const Feature = mongoose.model("Feature", featureSchema);

// Export the model so other files (like routes) can use it
module.exports = Feature;
