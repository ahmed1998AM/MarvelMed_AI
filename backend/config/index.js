require('dotenv').config();

module.exports = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tabib-al-ajaeib',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'tabib-al-ajaeib-super-secret-key-2024-change-in-production',
    expire: process.env.JWT_EXPIRE || '30d',
  },
  
  // AI Provider Keys - Support for 30+ Providers
  aiProviders: {
    // Major Providers
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: 'https://api.openai.com/v1',
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      enabled: !!process.env.OPENAI_API_KEY,
    },
    google: {
      apiKey: process.env.GOOGLE_AI_API_KEY,
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      models: ['gemini-pro', 'gemini-pro-vision'],
      enabled: !!process.env.GOOGLE_AI_API_KEY,
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseUrl: 'https://api.anthropic.com/v1',
      models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
      enabled: !!process.env.ANTHROPIC_API_KEY,
    },
    cohere: {
      apiKey: process.env.COHERE_API_KEY,
      baseUrl: 'https://api.cohere.ai/v1',
      models: ['command-r-plus', 'command-r', 'command'],
      enabled: !!process.env.COHERE_API_KEY,
    },
    replicate: {
      apiKey: process.env.REPLICATE_API_KEY,
      baseUrl: 'https://api.replicate.com/v1',
      models: ['meta/llama-2-70b-chat', 'mistralai/mistral-7b-instruct-v0.2'],
      enabled: !!process.env.REPLICATE_API_KEY,
    },
    huggingface: {
      apiKey: process.env.HUGGINGFACE_API_KEY,
      baseUrl: 'https://api-inference.huggingface.co/models',
      models: ['mistralai/Mixtral-8x7B-Instruct-v0.1', 'tiiuae/falcon-180B-chat'],
      enabled: !!process.env.HUGGINGFACE_API_KEY,
    },
    
    // Additional Cloud Providers
    azure: {
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT,
      models: ['gpt-4', 'gpt-35-turbo'],
      enabled: !!(process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT),
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
      models: ['anthropic.claude-v2', 'amazon.titan-text-express-v1'],
      enabled: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
    },
    vertex: {
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEY_FILE,
      models: ['text-bison', 'chat-bison'],
      enabled: !!(process.env.GCP_PROJECT_ID && process.env.GCP_KEY_FILE),
    },
    
    // Regional & Specialized Providers
    together: {
      apiKey: process.env.TOGETHER_API_KEY,
      baseUrl: 'https://api.together.xyz/v1',
      models: ['togethercomputer/LLaMA-2-70B-Chat', 'togethercomputer/Falcon-180B-Chat'],
      enabled: !!process.env.TOGETHER_API_KEY,
    },
    groq: {
      apiKey: process.env.GROQ_API_KEY,
      baseUrl: 'https://api.groq.com/openai/v1',
      models: ['mixtral-8x7b-32768', 'llama2-70b-4096'],
      enabled: !!process.env.GROQ_API_KEY,
    },
    perplexity: {
      apiKey: process.env.PERPLEXITY_API_KEY,
      baseUrl: 'https://api.perplexity.ai',
      models: ['pplx-7b-chat', 'pplx-70b-chat'],
      enabled: !!process.env.PERPLEXITY_API_KEY,
    },
    deepinfra: {
      apiKey: process.env.DEEPINFRA_API_KEY,
      baseUrl: 'https://api.deepinfra.com/v1/inference',
      models: ['mistralai/Mixtral-8x7B-Instruct-v0.1'],
      enabled: !!process.env.DEEPINFRA_API_KEY,
    },
    fireworks: {
      apiKey: process.env.FIREWORKS_API_KEY,
      baseUrl: 'https://api.fireworks.ai/inference/v1',
      models: ['accounts/fireworks/models/mixtral-8x7b-instruct'],
      enabled: !!process.env.FIREWORKS_API_KEY,
    },
    lepton: {
      apiKey: process.env.LEPTON_API_KEY,
      baseUrl: 'https://api.lepton.ai/api/v1',
      models: ['llama2-70b', 'mixtral-8x7b'],
      enabled: !!process.env.LEPTON_API_KEY,
    },
    
    // Open Source & Self-hosted Options
    ollama: {
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      models: ['llama2', 'mixtral', 'codellama'],
      enabled: true,
    },
    localai: {
      baseUrl: process.env.LOCALAI_BASE_URL || 'http://localhost:8080',
      models: ['gpt-3.5-turbo'],
      enabled: !!process.env.LOCALAI_BASE_URL,
    },
    vllm: {
      baseUrl: process.env.VLLM_BASE_URL || 'http://localhost:8000',
      models: ['facebook/opt-125m'],
      enabled: !!process.env.VLLM_BASE_URL,
    },
    
    // API Aggregators
    anyscale: {
      apiKey: process.env.ANYSCALE_API_KEY,
      baseUrl: 'https://api.endpoints.anyscale.com/v1',
      models: ['meta-llama/Llama-2-70b-chat-hf'],
      enabled: !!process.env.ANYSCALE_API_KEY,
    },
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseUrl: 'https://api.deepseek.com/v1',
      models: ['deepseek-chat', 'deepseek-coder'],
      enabled: !!process.env.DEEPSEEK_API_KEY,
    },
    jina: {
      apiKey: process.env.JINA_API_KEY,
      baseUrl: 'https://api.jina.ai/v1',
      models: ['jina-embeddings-v2-base-en'],
      enabled: !!process.env.JINA_API_KEY,
    },
    nomic: {
      apiKey: process.env.NOMIC_API_KEY,
      baseUrl: 'https://api-atlas.nomic.ai/v1',
      models: ['nomic-embed-text-v1'],
      enabled: !!process.env.NOMIC_API_KEY,
    },
    voyage: {
      apiKey: process.env.VOYAGE_API_KEY,
      baseUrl: 'https://api.voyageai.com/v1',
      models: ['voyage-large-2'],
      enabled: !!process.env.VOYAGE_API_KEY,
    },
    
    // Enterprise Providers
    ibm: {
      apiKey: process.env.IBM_WATSON_API_KEY,
      url: process.env.IBM_WATSON_URL,
      models: ['ibm/granite-13b-chat-v2'],
      enabled: !!(process.env.IBM_WATSON_API_KEY && process.env.IBM_WATSON_URL),
    },
    oracle: {
      apiKey: process.env.ORACLE_API_KEY,
      baseUrl: process.env.ORACLE_BASE_URL,
      models: ['cohere.command'],
      enabled: !!(process.env.ORACLE_API_KEY && process.env.ORACLE_BASE_URL),
    },
    alibaba: {
      apiKey: process.env.ALIBABA_DASHSCOPE_API_KEY,
      baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
      models: ['qwen-turbo', 'qwen-plus'],
      enabled: !!process.env.ALIBABA_DASHSCOPE_API_KEY,
    },
    baidu: {
      apiKey: process.env.BAIDU_API_KEY,
      secretKey: process.env.BAIDU_SECRET_KEY,
      baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1',
      models: ['ernie-bot', 'ernie-bot-turbo'],
      enabled: !!(process.env.BAIDU_API_KEY && process.env.BAIDU_SECRET_KEY),
    },
    tencent: {
      secretId: process.env.TENCENT_SECRET_ID,
      secretKey: process.env.TENCENT_SECRET_KEY,
      models: ['hunyuan'],
      enabled: !!(process.env.TENCENT_SECRET_ID && process.env.TENCENT_SECRET_KEY),
    },
    
    // Medical AI Specialists
    medpalm: {
      apiKey: process.env.GOOGLE_AI_API_KEY,
      baseUrl: 'https://healthcare.googleapis.com/v1',
      models: ['med-palm-2'],
      enabled: !!process.env.GOOGLE_AI_API_KEY,
    },
    bioBERT: {
      huggingfaceModel: 'dmis-lab/biobert-v1.1',
      apiKey: process.env.HUGGINGFACE_API_KEY,
      enabled: !!process.env.HUGGINGFACE_API_KEY,
    },
    clinicalBERT: {
      huggingfaceModel: 'emilyalsentzer/Bio_ClinicalBERT',
      apiKey: process.env.HUGGINGFACE_API_KEY,
      enabled: !!process.env.HUGGINGFACE_API_KEY,
    },
    
    // Vision & Image Analysis
    clarifai: {
      apiKey: process.env.CLARIFAI_API_KEY,
      userId: process.env.CLARIFAI_USER_ID,
      models: ['general-image-recognition', 'medical-models'],
      enabled: !!process.env.CLARIFAI_API_KEY,
    },
    imagga: {
      apiKey: process.env.IMAGGA_API_KEY,
      apiSecret: process.env.IMAGGA_API_SECRET,
      baseUrl: 'https://api.imagga.com/v2',
      enabled: !!(process.env.IMAGGA_API_KEY && process.env.IMAGGA_API_SECRET),
    },
    mindee: {
      apiKey: process.env.MINDEE_API_KEY,
      baseUrl: 'https://api.mindee.com/v1',
      enabled: !!process.env.MINDEE_API_KEY,
    },
    
    // Speech & Audio
    assemblyai: {
      apiKey: process.env.ASSEMBLYAI_API_KEY,
      baseUrl: 'https://api.assemblyai.com/v2',
      enabled: !!process.env.ASSEMBLYAI_API_KEY,
    },
    speechmatics: {
      apiKey: process.env.SPEECHMATICS_API_KEY,
      baseUrl: 'https://api.speechmatics.com/v2',
      enabled: !!process.env.SPEECHMATICS_API_KEY,
    },
    revai: {
      apiKey: process.env.REVAI_API_KEY,
      baseUrl: 'https://api.rev.ai/v1',
      enabled: !!process.env.REVAI_API_KEY,
    },
    
    // Additional Providers to reach 30+
    ai21: {
      apiKey: process.env.AI21_API_KEY,
      baseUrl: 'https://api.ai21.com/studio/v1',
      models: ['j2-ultra', 'j2-light'],
      enabled: !!process.env.AI21_API_KEY,
    },
    writer: {
      apiKey: process.env.WRITER_API_KEY,
      organizationId: process.env.WRITER_ORG_ID,
      models: ['palmyra-x'],
      enabled: !!(process.env.WRITER_API_KEY && process.env.WRITER_ORG_ID),
    },
    mosaic: {
      apiKey: process.env.MOSAIC_ML_API_KEY,
      baseUrl: 'https://api.mosaicml.com/v1',
      models: ['mpt-7b-chat'],
      enabled: !!process.env.MOSAIC_ML_API_KEY,
    },
    character: {
      apiKey: process.env.CHARACTER_API_KEY,
      baseUrl: 'https://api.character.ai/v1',
      enabled: !!process.env.CHARACTER_API_KEY,
    },
    forefront: {
      apiKey: process.env.FOREFRONT_API_KEY,
      baseUrl: 'https://api.forefront.ai/v1',
      enabled: !!process.env.FOREFRONT_API_KEY,
    },
  },
  
  // Firebase Configuration
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  },
  
  // Payment Gateway Configuration
  payment: {
    // Egypt - Fawry
    fawry: {
      merchantCode: process.env.FAWRY_MERCHANT_CODE,
      secretKey: process.env.FAWRY_SECRET_KEY,
      baseUrl: process.env.FAWRY_BASE_URL || 'https://atufawry.atu.net',
      enabled: !!(process.env.FAWRY_MERCHANT_CODE && process.env.FAWRY_SECRET_KEY),
    },
    // Egypt - Paymob
    paymob: {
      apiKey: process.env.PAYMOB_API_KEY,
      integrationId: process.env.PAYMOB_INTEGRATION_ID,
      iframeId: process.env.PAYMOB_IFRAME_ID,
      baseUrl: 'https://accept.paymob.com',
      enabled: !!process.env.PAYMOB_API_KEY,
    },
    // Egypt - PayTabs
    paytabs: {
      profileId: process.env.PAYTABS_PROFILE_ID,
      serverKey: process.env.PAYTABS_SERVER_KEY,
      baseUrl: 'https://secure.paytabs.com',
      enabled: !!(process.env.PAYTABS_PROFILE_ID && process.env.PAYTABS_SERVER_KEY),
    },
    // Egypt - Khazna
    khazna: {
      apiKey: process.env.KHAZNA_API_KEY,
      baseUrl: process.env.KHAZNA_BASE_URL,
      enabled: !!(process.env.KHAZNA_API_KEY && process.env.KHAZNA_BASE_URL),
    },
    // International - Stripe
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      enabled: !!process.env.STRIPE_SECRET_KEY,
    },
    // International - PayPal
    paypal: {
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
      sandbox: process.env.PAYPAL_SANDBOX === 'true',
      enabled: !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
    },
    // Gulf - Tap Payments
    tap: {
      secretKey: process.env.TAP_SECRET_KEY,
      publicKey: process.env.TAP_PUBLIC_KEY,
      baseUrl: 'https://api.tap.company/v2',
      enabled: !!process.env.TAP_SECRET_KEY,
    },
    // Gulf - Moyasar
    moyasar: {
      secretKey: process.env.MOYASAR_SECRET_KEY,
      publishableKey: process.env.MOYASAR_PUBLISHABLE_KEY,
      baseUrl: 'https://api.moyasar.com',
      enabled: !!process.env.MOYASAR_SECRET_KEY,
    },
    // International - Razorpay (for expansion)
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID,
      keySecret: process.env.RAZORPAY_KEY_SECRET,
      enabled: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    },
    // Crypto - Coinbase Commerce
    coinbase: {
      apiKey: process.env.COINBASE_API_KEY,
      webhookSecret: process.env.COINBASE_WEBHOOK_SECRET,
      enabled: !!process.env.COINBASE_API_KEY,
    },
    // Mobile Wallets Integration
    vodafonCash: {
      apiKey: process.env.VODAFON_CASH_API_KEY,
      merchantId: process.env.VODAFON_CASH_MERCHANT_ID,
      enabled: !!process.env.VODAFON_CASH_API_KEY,
    },
    etisalatCash: {
      apiKey: process.env.ETISALAT_CASH_API_KEY,
      merchantId: process.env.ETISALAT_CASH_MERCHANT_ID,
      enabled: !!process.env.ETISALAT_CASH_API_KEY,
    },
    orangeCash: {
      apiKey: process.env.ORANGE_CASH_API_KEY,
      merchantId: process.env.ORANGE_CASH_MERCHANT_ID,
      enabled: !!process.env.ORANGE_CASH_API_KEY,
    },
    weCash: {
      apiKey: process.env.WE_CASH_API_KEY,
      merchantId: process.env.WE_CASH_MERCHANT_ID,
      enabled: !!process.env.WE_CASH_API_KEY,
    },
  },
  
  // Email Configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'طبيب العجائب <no-reply@tabib-al-ajaeib.com>',
  },
  
  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/tiff',
      'image/dicom',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'audio/mpeg',
      'audio/wav',
      'audio/webm',
    ],
    storagePath: process.env.UPLOAD_PATH || './uploads',
  },
  
  // Frontend URL (for CORS)
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Developer Info
  developer: {
    name: process.env.DEVELOPER_NAME || 'احمد مصطفي ابراهيم',
    phone: process.env.DEVELOPER_PHONE || '01225155329',
    email: process.env.DEVELOPER_EMAIL || 'a12345.mostafa@gmail.com',
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  
  // Cache Configuration
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true',
    ttl: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
    },
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },
};
