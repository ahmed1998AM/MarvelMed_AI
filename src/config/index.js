export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const aiProviders = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    enabled: true,
    models: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-vision-preview'],
  },
  google: {
    apiKey: import.meta.env.VITE_GOOGLE_AI_KEY,
    enabled: true,
    models: ['gemini-pro', 'gemini-pro-vision'],
  },
  anthropic: {
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    enabled: true,
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
  },
  cohere: {
    apiKey: import.meta.env.VITE_COHERE_API_KEY,
    enabled: true,
    models: ['command', 'command-light'],
  },
  replicate: {
    apiKey: import.meta.env.VITE_REPLICATE_API_KEY,
    enabled: true,
    models: ['llama-2-70b-chat', 'medical-image-analysis'],
  },
  huggingface: {
    apiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY,
    enabled: true,
    models: ['medical-bert', 'radiology-report-generator'],
  },
};

export const paymentMethods = {
  stripe: {
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
    enabled: true,
  },
  paypal: {
    enabled: true,
  },
  localPayment: {
    enabled: true,
    methods: ['فودافون كاش', 'اتصالات كاش', 'اورنج كاش', 'وي كاش', 'ميزة', 'فوري'],
  },
};

export const appInfo = {
  name: import.meta.env.VITE_APP_NAME || 'طبيب العجائب',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  developer: {
    name: 'Ahmed Mostafa Ibrahim',
    email: 'a12345.mostafa@gmail.com',
    phone: '01225155329',
  },
};
