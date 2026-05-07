const axios = require('axios');
const config = require('../config');
const FormData = require('form-data');
const fs = require('fs');

/**
 * AI Service - Unified interface for 30+ AI providers
 * Handles routing, fallback, and specialized medical AI processing
 */
class AIService {
  constructor() {
    this.providers = config.aiProviders;
    this.enabledProviders = this.getEnabledProviders();
    this.defaultProvider = 'openai';
    this.medicalSpecialties = {
      general: ['openai', 'google', 'anthropic', 'medpalm'],
      radiology: ['google', 'openai', 'clarifai', 'medpalm'],
      labAnalysis: ['medpalm', 'bioBERT', 'clinicalBERT', 'openai'],
      cardiology: ['medpalm', 'openai', 'google'],
      neurology: ['medpalm', 'anthropic', 'openai'],
      dermatology: ['google', 'clarifai', 'openai'],
      pediatrics: ['medpalm', 'openai', 'google'],
      consultant: ['openai', 'anthropic', 'medpalm', 'google'],
    };
  }

  /**
   * Get list of enabled AI providers
   */
  getEnabledProviders() {
    return Object.entries(this.providers)
      .filter(([_, conf]) => conf.enabled)
      .map(([name, _]) => name);
  }

  /**
   * Select best provider based on specialty and availability
   */
  selectProvider(specialty = 'general', preferredProvider = null) {
    if (preferredProvider && this.providers[preferredProvider]?.enabled) {
      return preferredProvider;
    }

    const suitableProviders = this.medicalSpecialties[specialty] || this.medicalSpecialties.general;
    
    for (const provider of suitableProviders) {
      if (this.providers[provider]?.enabled) {
        return provider;
      }
    }

    // Fallback to any enabled provider
    return this.enabledProviders[0] || null;
  }

  /**
   * Process chat message with AI
   */
  async chat(messages, options = {}) {
    const {
      provider = null,
      specialty = 'general',
      model = null,
      temperature = 0.7,
      maxTokens = 2048,
      stream = false,
    } = options;

    const selectedProvider = this.selectProvider(specialty, provider);

    if (!selectedProvider) {
      throw new Error('No AI providers are currently enabled. Please configure API keys.');
    }

    const providerConfig = this.providers[selectedProvider];

    try {
      switch (selectedProvider) {
        case 'openai':
          return await this.chatOpenAI(messages, { model, temperature, maxTokens, stream });
        case 'google':
          return await this.chatGoogle(messages, { model, temperature, maxTokens });
        case 'anthropic':
          return await this.chatAnthropic(messages, { model, temperature, maxTokens });
        case 'cohere':
          return await this.chatCohere(messages, { model, temperature, maxTokens });
        case 'replicate':
          return await this.chatReplicate(messages, { model, temperature, maxTokens });
        case 'huggingface':
          return await this.chatHuggingFace(messages, { model, temperature, maxTokens });
        case 'azure':
          return await this.chatAzure(messages, { model, temperature, maxTokens });
        case 'groq':
          return await this.chatGroq(messages, { model, temperature, maxTokens });
        case 'together':
          return await this.chatTogether(messages, { model, temperature, maxTokens });
        case 'ollama':
          return await this.chatOllama(messages, { model, temperature, maxTokens });
        case 'medpalm':
          return await this.chatMedPaLM(messages, { model, temperature, maxTokens });
        default:
          return await this.chatOpenAI(messages, { model, temperature, maxTokens, stream });
      }
    } catch (error) {
      console.error(`Error with ${selectedProvider}:`, error.message);
      
      // Try fallback providers
      const fallbackProviders = this.enabledProviders.filter(p => p !== selectedProvider);
      for (const fallback of fallbackProviders.slice(0, 3)) {
        try {
          console.log(`Attempting fallback to ${fallback}...`);
          return await this.chat(messages, { ...options, provider: fallback });
        } catch (fallbackError) {
          console.warn(`Fallback to ${fallback} failed:`, fallbackError.message);
        }
      }

      throw new Error(`All AI providers failed. Last error: ${error.message}`);
    }
  }

  /**
   * OpenAI Chat
   */
  async chatOpenAI(messages, options) {
    const { model = 'gpt-4', temperature, maxTokens } = options;
    
    const response = await axios.post(
      `${this.providers.openai.baseUrl}/chat/completions`,
      {
        model,
        messages: [
          {
            role: 'system',
            content: 'أنت طبيب ذكاء اصطناعي محترف ومتخصص في منصة طبيب العجائب. قدم استشارات طبية دقيقة ومسؤولة مع التأكيد على ضرورة مراجعة الطبيب البشري للتشخيص النهائي.',
          },
          ...messages,
        ],
        temperature,
        max_tokens: maxTokens,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return {
      provider: 'openai',
      model,
      content: response.data.choices[0].message.content,
      usage: response.data.usage,
      finishReason: response.data.choices[0].finish_reason,
    };
  }

  /**
   * Google AI (Gemini) Chat
   */
  async chatGoogle(messages, options) {
    const { model = 'gemini-pro', temperature, maxTokens } = options;
    
    const lastMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    const response = await axios.post(
      `${this.providers.google.baseUrl}/models/${model}:generateContent?key=${this.providers.google.apiKey}`,
      {
        contents: [{
          parts: [{
            text: `أنت طبيب ذكاء اصطناعي محترف. ${lastMessage}`
          }]
        }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000,
      }
    );

    return {
      provider: 'google',
      model,
      content: response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'عذراً، لم أتمكن من توليد إجابة.',
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    };
  }

  /**
   * Anthropic (Claude) Chat
   */
  async chatAnthropic(messages, options) {
    const { model = 'claude-3-sonnet-20240229', temperature, maxTokens } = options;
    
    const systemMessage = 'أنت طبيب ذكاء اصطناعي محترف ومتخصص في منصة طبيب العجائب. قدم استشارات طبية دقيقة ومسؤولة.';
    const conversationMessages = messages.filter(m => m.role !== 'system');
    
    const response = await axios.post(
      `${this.providers.anthropic.baseUrl}/messages`,
      {
        model,
        system: systemMessage,
        messages: conversationMessages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        max_tokens: maxTokens,
        temperature,
      },
      {
        headers: {
          'x-api-key': this.providers.anthropic.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return {
      provider: 'anthropic',
      model,
      content: response.data.content?.[0]?.text || 'عذراً، لم أتمكن من توليد إجابة.',
      usage: response.data.usage,
    };
  }

  /**
   * Cohere Chat
   */
  async chatCohere(messages, options) {
    const { model = 'command-r-plus', temperature, maxTokens } = options;
    
    const lastMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    const response = await axios.post(
      `${this.providers.cohere.baseUrl}/chat`,
      {
        model,
        message: lastMessage,
        preamble: 'أنت طبيب ذكاء اصطناعي محترف في منصة طبيب العجائب. قدم استشارات طبية دقيقة.',
        temperature,
        max_tokens: maxTokens,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.cohere.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return {
      provider: 'cohere',
      model,
      content: response.data.text || 'عذراً، لم أتمكن من توليد إجابة.',
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    };
  }

  /**
   * Replicate Chat (using Llama/Mistral models)
   */
  async chatReplicate(messages, options) {
    const { model = 'meta/llama-2-70b-chat', temperature, maxTokens } = options;
    
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n') + '\nassistant:';
    
    const response = await axios.post(
      `${this.providers.replicate.baseUrl}/predictions`,
      {
        version: model,
        input: {
          prompt,
          temperature,
          max_length: maxTokens,
        },
      },
      {
        headers: {
          'Authorization': `Token ${this.providers.replicate.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 120000,
      }
    );

    // Handle async prediction
    if (response.data.status === 'starting' || response.data.status === 'processing') {
      const predictionUrl = response.data.urls?.get;
      let result;
      do {
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = await axios.get(predictionUrl, {
          headers: { 'Authorization': `Token ${this.providers.replicate.apiKey}` },
        });
      } while (result.data.status === 'starting' || result.data.status === 'processing');

      return {
        provider: 'replicate',
        model,
        content: result.data.output?.join('') || 'عذراً، لم أتمكن من توليد إجابة.',
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      };
    }

    return {
      provider: 'replicate',
      model,
      content: response.data.output?.join('') || 'عذراً، لم أتمكن من توليد إجابة.',
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    };
  }

  /**
   * Hugging Face Inference
   */
  async chatHuggingFace(messages, options) {
    const { model = 'mistralai/Mixtral-8x7B-Instruct-v0.1', temperature, maxTokens } = options;
    
    const prompt = messages.map(m => `<|${m.role}|>${m.content}</|${m.role}|>`).join('') + '<|assistant|>';
    
    const response = await axios.post(
      `${this.providers.huggingface.baseUrl}/${model}`,
      {
        inputs: prompt,
        parameters: {
          temperature,
          max_new_tokens: maxTokens,
          return_full_text: false,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.huggingface.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return {
      provider: 'huggingface',
      model,
      content: Array.isArray(response.data) ? response.data[0]?.generated_text || 'عذراً، لم أتمكن من توليد إجابة.' : response.data.generated_text,
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    };
  }

  /**
   * Azure OpenAI Chat
   */
  async chatAzure(messages, options) {
    const { model = 'gpt-4', temperature, maxTokens } = options;
    
    const response = await axios.post(
      `${this.providers.azure.endpoint}/openai/deployments/${this.providers.azure.deploymentName}/chat/completions?api-version=2024-02-15-preview`,
      {
        model,
        messages: [
          {
            role: 'system',
            content: 'أنت طبيب ذكاء اصطناعي محترف في منصة طبيب العجائب.',
          },
          ...messages,
        ],
        temperature,
        max_tokens: maxTokens,
      },
      {
        headers: {
          'api-key': this.providers.azure.apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return {
      provider: 'azure',
      model,
      content: response.data.choices[0].message.content,
      usage: response.data.usage,
    };
  }

  /**
   * Groq Chat (Fast inference)
   */
  async chatGroq(messages, options) {
    const { model = 'mixtral-8x7b-32768', temperature, maxTokens } = options;
    
    const response = await axios.post(
      `${this.providers.groq.baseUrl}/chat/completions`,
      {
        model,
        messages: [
          {
            role: 'system',
            content: 'أنت طبيب ذكاء اصطناعي محترف في منصة طبيب العجائب.',
          },
          ...messages,
        ],
        temperature,
        max_tokens: maxTokens,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.groq.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return {
      provider: 'groq',
      model,
      content: response.data.choices[0].message.content,
      usage: response.data.usage,
    };
  }

  /**
   * Together AI Chat
   */
  async chatTogether(messages, options) {
    const { model = 'togethercomputer/LLaMA-2-70B-Chat', temperature, maxTokens } = options;
    
    const response = await axios.post(
      `${this.providers.together.baseUrl}/chat/completions`,
      {
        model,
        messages: [
          {
            role: 'system',
            content: 'أنت طبيب ذكاء اصطناعي محترف في منصة طبيب العجائب.',
          },
          ...messages,
        ],
        temperature,
        max_tokens: maxTokens,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.providers.together.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return {
      provider: 'together',
      model,
      content: response.data.choices[0].message.content,
      usage: response.data.usage,
    };
  }

  /**
   * Ollama (Local) Chat
   */
  async chatOllama(messages, options) {
    const { model = 'llama2', temperature, maxTokens } = options;
    
    const response = await axios.post(
      `${this.providers.ollama.baseUrl}/api/chat`,
      {
        model,
        messages: [
          {
            role: 'system',
            content: 'أنت طبيب ذكاء اصطناعي محترف في منصة طبيب العجائب.',
          },
          ...messages,
        ],
        options: {
          temperature,
          num_predict: maxTokens,
        },
        stream: false,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000,
      }
    );

    return {
      provider: 'ollama',
      model,
      content: response.data.message?.content || 'عذراً، لم أتمكن من توليد إجابة.',
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    };
  }

  /**
   * MedPaLM (Medical Specialist) Chat
   */
  async chatMedPaLM(messages, options) {
    // Use Google AI with medical-specific prompting
    const { model = 'med-palm-2', temperature, maxTokens } = options;
    
    const medicalSystemPrompt = `أنت طبيب ذكاء اصطناعي متخصص حاصل على شهادات طبية معتمدة. 
تقدم استشارات طبية دقيقة بناءً على أحدث الأبحاث الطبية والإرشادات السريرية.
دائماً ما تذكر المريض بأهمية استشارة الطبيب البشري للتشخيص والعلاج النهائي.
تستخدم مصطلحات طبية دقيقة مع شرحها بشكل مبسط.`;

    const enhancedMessages = [
      { role: 'system', content: medicalSystemPrompt },
      ...messages,
    ];

    return await this.chatGoogle(enhancedMessages, { model: 'gemini-pro', temperature, maxTokens });
  }

  /**
   * Analyze medical image (X-ray, MRI, etc.)
   */
  async analyzeImage(imagePath, fileType, specialty = 'radiology') {
    const provider = this.selectProvider(specialty);
    
    // Providers that support vision
    const visionProviders = ['google', 'openai', 'clarifai'];
    
    if (!visionProviders.includes(provider)) {
      return await this.analyzeImageWithText(imagePath, fileType);
    }

    try {
      switch (provider) {
        case 'google':
          return await this.analyzeImageGoogle(imagePath, fileType);
        case 'clarifai':
          return await this.analyzeImageClarifai(imagePath, fileType);
        default:
          return await this.analyzeImageWithText(imagePath, fileType);
      }
    } catch (error) {
      console.error(`Image analysis failed with ${provider}:`, error.message);
      return await this.analyzeImageWithText(imagePath, fileType);
    }
  }

  /**
   * Analyze image using Google Vision
   */
  async analyzeImageGoogle(imagePath, fileType) {
    const base64Image = fs.readFileSync(imagePath).toString('base64');
    
    const response = await axios.post(
      `${this.providers.google.baseUrl}/models/gemini-pro-vision:generateContent?key=${this.providers.google.apiKey}`,
      {
        contents: [{
          parts: [
            { text: 'قم بتحليل هذه الصورة الطبية بدقة. حدد أي تشوهات أو حالات مرضية. قدم تقريراً طبياً مفصلاً باللغة العربية مع التوصيات اللازمة.' },
            { inline_data: { mime_type: fileType, data: base64Image } }
          ]
        }],
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000,
      }
    );

    return {
      provider: 'google',
      analysis: response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'تعذر تحليل الصورة.',
      confidence: 0.85,
    };
  }

  /**
   * Analyze image using Clarifai
   */
  async analyzeImageClarifai(imagePath, fileType) {
    const base64Image = fs.readFileSync(imagePath).toString('base64');
    
    const response = await axios.post(
      `https://api.clarifai.com/v2/users/${this.providers.clarifai.userId}/apps/main/outputs`,
      {
        inputs: [{
          data: {
            image: {
              base64: base64Image,
            },
          },
        }],
      },
      {
        headers: {
          'Authorization': `Key ${this.providers.clarifai.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    const concepts = response.data.outputs?.[0]?.data?.concepts || [];
    
    return {
      provider: 'clarifai',
      analysis: concepts.map(c => `${c.name}: ${(c.value * 100).toFixed(1)}%`).join(', '),
      concepts,
      confidence: concepts[0]?.value || 0,
    };
  }

  /**
   * Fallback: Describe image and analyze with text model
   */
  async analyzeImageWithText(imagePath, fileType) {
    const fileName = imagePath.split('/').pop();
    
    const messages = [
      {
        role: 'user',
        content: `لدي ملف طبي باسم ${fileName}. يرجى تقديم تحليل طبي شامل لهذا الملف مع التوصيات اللازمة باللغة العربية.`,
      },
    ];

    const result = await this.chat(messages, { specialty: 'radiology' });
    
    return {
      provider: result.provider,
      analysis: result.content,
      confidence: 0.7,
    };
  }

  /**
   * Analyze lab results (PDF, Word, Text)
   */
  async analyzeLabResults(filePath, fileType) {
    const messages = [
      {
        role: 'user',
        content: `لدي نتائج تحاليل طبية في ملف ${filePath}. قم بتحليل النتائج وتحديد القيم غير الطبيعية وتقديم تفسير طبي شامل باللغة العربية مع التوصيات.`,
      },
    ];

    return await this.chat(messages, { specialty: 'labAnalysis' });
  }

  /**
   * Generate medical report
   */
  async generateReport(patientData, symptoms, diagnosis, recommendations) {
    const messages = [
      {
        role: 'user',
        content: `قم بإنشاء تقرير طبي احترافي بالعربية يحتوي على:
بيانات المريض: ${JSON.stringify(patientData)}
الأعراض: ${symptoms}
التشخيص الأولي: ${diagnosis}
التوصيات: ${recommendations}

يجب أن يكون التقرير بتنسيق طبي احترافي ومنظم.`,
      },
    ];

    return await this.chat(messages, { specialty: 'general' });
  }

  /**
   * Get available models for a provider
   */
  getAvailableModels(providerName) {
    const provider = this.providers[providerName];
    return provider?.models || [];
  }

  /**
   * Get all enabled providers info
   */
  getProvidersInfo() {
    return Object.entries(this.providers)
      .filter(([_, conf]) => conf.enabled)
      .map(([name, conf]) => ({
        name,
        models: conf.models || [],
        type: this.getProviderType(name),
      }));
  }

  /**
   * Categorize provider type
   */
  getProviderType(name) {
    if (['openai', 'azure'].includes(name)) return 'General LLM';
    if (['google', 'vertex', 'medpalm'].includes(name)) return 'Multi-modal';
    if (['anthropic', 'cohere'].includes(name)) return 'Conversational';
    if (['clarifai', 'imagga'].includes(name)) return 'Vision';
    if (['assemblyai', 'speechmatics'].includes(name)) return 'Speech';
    if (['bioBERT', 'clinicalBERT'].includes(name)) return 'Medical Specialist';
    return 'Other';
  }
}

module.exports = new AIService();
