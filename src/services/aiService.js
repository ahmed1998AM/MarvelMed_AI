import axios from 'axios';
import { aiProviders } from '../config';

class AIService {
  constructor() {
    this.currentProvider = 'openai';
    this.medicalAgents = {
      general: {
        name: 'الدكتور العام',
        specialty: 'الطب العام',
        description: 'متخصص في التشخيص الأولي والاستشارات الطبية العامة',
        provider: 'openai',
        model: 'gpt-4',
        systemPrompt: `أنت طبيب ذكاء اصطناعي محترف متخصص في الطب العام. 
        مهمتك هي تحليل الأعراض وتقديم تشخيص أولي احترافي مع التوصيات المناسبة.
        دائماً تذكر المستخدم باستشارة طبيب بشري للتشخيص النهائي.
        قدم إجابات مفصلة واحترافية باللغة العربية.`,
      },
      radiology: {
        name: 'دكتور الأشعة',
        specialty: 'تحليل الأشعة',
        description: 'متخصص في تحليل صور الأشعة والتصوير الطبي',
        provider: 'google',
        model: 'gemini-pro-vision',
        systemPrompt: `أنت خبير في تحليل صور الأشعة والتصوير الطبي.
        يمكنك تحليل صور X-ray, CT, MRI, Ultrasound وغيرها.
        قدم تحليلاً مفصلاً ودقيقاً مع ذكر الملاحظات المهمة.`,
      },
      lab: {
        name: 'دكتور التحاليل',
        specialty: 'تحليل التقارير المعملية',
        description: 'متخصص في تحليل نتائج التحاليل الطبية',
        provider: 'openai',
        model: 'gpt-4',
        systemPrompt: `أنت خبير في تحليل نتائج التحاليل الطبية والمعملية.
        يمكنك تفسير نتائج CBC, Liver Function, Kidney Function, Hormones وغيرها.
        اشرح النتائج بشكل واضح ومفهوم مع توضيح القيم الطبيعية وغير الطبيعية.`,
      },
      cardiology: {
        name: 'دكتور القلب',
        specialty: 'أمراض القلب',
        description: 'متخصص في أمراض القلب والأوعية الدموية',
        provider: 'anthropic',
        model: 'claude-3-opus',
        systemPrompt: `أنت استشاري أمراض قلب ذكاء اصطناعي.
        متخصص في تحليل تخطيط القلب ECG وأعراض أمراض القلب.
        قدم استشارات احترافية مع التوصيات المناسبة.`,
      },
      neurology: {
        name: 'دكتور المخ والأعصاب',
        specialty: 'المخ والأعصاب',
        description: 'متخصص في أمراض المخ والجهاز العصبي',
        provider: 'openai',
        model: 'gpt-4',
        systemPrompt: `أنت خبير في أمراض المخ والأعصاب.
        يمكنك تحليل أعراض الجهاز العصبي وتقديم استشارات متخصصة.`,
      },
      dermatology: {
        name: 'دكتور الجلد',
        specialty: 'الأمراض الجلدية',
        description: 'متخصص في الأمراض الجلدية وتحليل صور الجلد',
        provider: 'google',
        model: 'gemini-pro-vision',
        systemPrompt: `أنت خبير في الأمراض الجلدية.
        يمكنك تحليل صور الجلد وتشخيص الحالات الجلدية المختلفة.`,
      },
      pediatrics: {
        name: 'دكتور الأطفال',
        specialty: 'طب الأطفال',
        description: 'متخصص في صحة الأطفال والرعاية pediatric',
        provider: 'openai',
        model: 'gpt-4',
        systemPrompt: `أنت طبيب أطفال ذكاء اصطناعي محترف.
        متخصص في رعاية الأطفال وتشخيص أمراضهم.
        قدم نصائح مناسبة للأعمار المختلفة.`,
      },
      consultant: {
        name: 'الاستشاري العام',
        specialty: 'استشارات متعددة التخصصات',
        description: 'يستشير جميع التخصصات للحالات المعقدة',
        provider: 'openai',
        model: 'gpt-4',
        systemPrompt: `أنت استشاري طبي عام ذو خبرة واسعة في جميع التخصصات.
        يمكنك تحليل الحالات المعقدة وتقديم آراء شاملة.
        تنسق بين مختلف التخصصات الطبية لتقديم أفضل رعاية.`,
      },
    };
  }

  async chatWithAgent(agentType, message, medicalHistory = [], attachments = []) {
    const agent = this.medicalAgents[agentType] || this.medicalAgents.general;
    
    try {
      switch (agent.provider) {
        case 'openai':
          return await this.callOpenAI(agent, message, medicalHistory, attachments);
        case 'google':
          return await this.callGoogleAI(agent, message, medicalHistory, attachments);
        case 'anthropic':
          return await this.callAnthropic(agent, message, medicalHistory, attachments);
        case 'cohere':
          return await this.callCohere(agent, message, medicalHistory, attachments);
        default:
          return await this.callOpenAI(agent, message, medicalHistory, attachments);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('حدث خطأ في معالجة الطلب. يرجى المحاولة مرة أخرى.');
    }
  }

  async callOpenAI(agent, message, medicalHistory, attachments) {
    const messages = [
      { role: 'system', content: agent.systemPrompt },
      ...medicalHistory,
      { role: 'user', content: message },
    ];

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: agent.model,
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${aiProviders.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      response: response.data.choices[0].message.content,
      agent: agent.name,
      timestamp: new Date().toISOString(),
    };
  }

  async callGoogleAI(agent, message, medicalHistory, attachments) {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(aiProviders.google.apiKey);
    const model = genAI.getGenerativeModel({ model: agent.model });

    let prompt = `${agent.systemPrompt}\n\n`;
    if (medicalHistory.length > 0) {
      prompt += `سجل المحادثة:\n${JSON.stringify(medicalHistory)}\n\n`;
    }
    prompt += `المستخدم: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return {
      response: response.text(),
      agent: agent.name,
      timestamp: new Date().toISOString(),
    };
  }

  async callAnthropic(agent, message, medicalHistory, attachments) {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: agent.model,
        max_tokens: 2000,
        system: agent.systemPrompt,
        messages: [
          ...medicalHistory,
          { role: 'user', content: message },
        ],
      },
      {
        headers: {
          'x-api-key': aiProviders.anthropic.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      response: response.data.content[0].text,
      agent: agent.name,
      timestamp: new Date().toISOString(),
    };
  }

  async callCohere(agent, message, medicalHistory, attachments) {
    const response = await axios.post(
      'https://api.cohere.ai/v1/chat',
      {
        model: agent.model,
        message: message,
        preamble: agent.systemPrompt,
        chat_history: medicalHistory.map(msg => ({
          role: msg.role === 'user' ? 'USER' : 'CHATBOT',
          message: msg.content,
        })),
      },
      {
        headers: {
          'Authorization': `Bearer ${aiProviders.cohere.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      response: response.data.text,
      agent: agent.name,
      timestamp: new Date().toISOString(),
    };
  }

  getAvailableAgents() {
    return Object.values(this.medicalAgents);
  }

  getAgentById(id) {
    return this.medicalAgents[id];
  }

  async analyzeImage(file, agentType = 'radiology') {
    const agent = this.medicalAgents[agentType];
    
    // Convert image to base64
    const base64Image = await this.fileToBase64(file);
    
    if (agent.provider === 'google' && agent.model.includes('vision')) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(aiProviders.google.apiKey);
      const model = genAI.getGenerativeModel({ model: agent.model });

      const imageParts = [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: file.type,
          },
        },
      ];

      const result = await model.generateContent([
        agent.systemPrompt,
        '\nحلل هذه الصورة الطبية بدقة وقدم تقريراً مفصلاً.',
        ...imageParts,
      ]);
      
      return {
        response: result.response.text(),
        agent: agent.name,
        timestamp: new Date().toISOString(),
      };
    }

    throw new Error('هذا الوكيل لا يدعم تحليل الصور');
  }

  async analyzeDocument(file, agentType = 'lab') {
    const agent = this.medicalAgents[agentType];
    let text = '';

    // Extract text based on file type
    if (file.type === 'application/pdf') {
      const pdfjsLib = await import('pdfjs-dist');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        text += textContent.items.map(item => item.str).join(' ');
      }
    } else if (file.type.startsWith('image/')) {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('ara+eng');
      const ret = await worker.recognize(file);
      text = ret.data.text;
      await worker.terminate();
    } else {
      text = await file.text();
    }

    return await this.chatWithAgent(agentType, `حلل هذا المستند الطبي:\n\n${text}`, []);
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}

export default new AIService();
