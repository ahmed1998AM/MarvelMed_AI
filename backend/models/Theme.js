const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['light', 'dark', 'medical', 'professional', 'modern', 'custom'],
    default: 'custom'
  },
  colors: {
    primary: {
      main: String,
      light: String,
      dark: String,
      contrast: String
    },
    secondary: {
      main: String,
      light: String,
      dark: String,
      contrast: String
    },
    accent: {
      main: String,
      light: String,
      dark: String
    },
    background: {
      primary: String,
      secondary: String,
      tertiary: String,
      paper: String
    },
    surface: {
      primary: String,
      secondary: String,
      elevated: String
    },
    text: {
      primary: String,
      secondary: String,
      disabled: String,
      hint: String
    },
    border: {
      light: String,
      medium: String,
      dark: String
    },
    status: {
      success: String,
      warning: String,
      error: String,
      info: String
    }
  },
  typography: {
    fontFamily: {
      primary: String,
      secondary: String,
      mono: String
    },
    fontSize: {
      xs: String,
      sm: String,
      base: String,
      lg: String,
      xl: String,
      '2xl': String,
      '3xl': String
    },
    fontWeight: {
      light: Number,
      regular: Number,
      medium: Number,
      semibold: Number,
      bold: Number
    }
  },
  spacing: {
    unit: {
      type: String,
      default: 'px'
    },
    scale: [Number]
  },
  borderRadius: {
    sm: String,
    md: String,
    lg: String,
    xl: String,
    full: String
  },
  shadows: {
    sm: String,
    md: String,
    lg: String,
    xl: String,
    '2xl': String,
    inner: String,
    glow: String
  },
  effects: {
    glassmorphism: Boolean,
    gradients: Boolean,
    animations: Boolean,
    transitions: String
  },
  components: {
    header: {
      height: String,
      background: String,
      shadow: String
    },
    sidebar: {
      width: String,
      background: String,
      collapsedWidth: String
    },
    card: {
      padding: String,
      background: String,
      border: String,
      shadow: String
    },
    button: {
      padding: String,
      borderRadius: String,
      fontWeight: String
    },
    input: {
      padding: String,
      borderRadius: String,
      borderColor: String
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  previewImage: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [String],
  version: {
    type: String,
    default: '1.0.0'
  }
}, {
  timestamps: true
});

// Indexes
themeSchema.index({ category: 1, isActive: 1 });
themeSchema.index({ isDefault: 1 });
themeSchema.index({ 'rating.average': -1 });

// Get all active themes
themeSchema.statics.getActiveThemes = async function(category = null) {
  const query = { isActive: true };
  if (category) query.category = category;
  
  return this.find(query).sort({ isDefault: -1, downloads: -1 });
};

// Apply theme to user
themeSchema.methods.applyToUser = async function(userId) {
  const User = mongoose.model('User');
  await User.findByIdAndUpdate(userId, { 
    preferences: { ...((await User.findById(userId)).preferences || {}), theme: this.name } 
  });
};

module.exports = mongoose.model('Theme', themeSchema);
