import { pipeline, Pipeline, env } from '@xenova/transformers';

// Configure transformers for web usage
env.allowLocalModels = false;
env.allowRemoteModels = true;
env.useBrowserCache = true;

// Always set WASM paths for ONNX Runtime Web backend
env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/';

// Set Hugging Face token if available
const HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN;

interface AIModels {
  classifier: Pipeline | null;
  embedder: Pipeline | null;
  sentiment: Pipeline | null;
  ner: Pipeline | null;
  summarizer: Pipeline | null;
}

class AIService {
  private models: AIModels = {
    classifier: null,
    embedder: null,
    sentiment: null,
    ner: null,
    summarizer: null
  };

  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private fallbackMode = true; // Start in fallback mode by default
  private loadingAttempted = false;

  async initialize(): Promise<{ success: boolean; error?: any }> {
    if (this.initialized) {
      return { success: true };
    }

    if (this.initPromise) {
      await this.initPromise;
      return { success: this.initialized };
    }

    // Only attempt to load models if we have a valid token and haven't tried before
    if (HF_TOKEN && HF_TOKEN !== 'your_huggingface_token_here' && !this.loadingAttempted) {
      this.initPromise = this.attemptModelLoading();
      
      try {
        await this.initPromise;
      } catch (error) {
        console.warn('AI models failed to load, using fallback mode:', error);
        this.fallbackMode = true;
      }
    } else {
      console.log('Using fallback AI mode (no valid token or previous attempt failed)');
      this.fallbackMode = true;
    }

    this.initialized = true;
    return { success: true };
  }

  private async attemptModelLoading(): Promise<void> {
    this.loadingAttempted = true;
    
    try {
      console.log('Attempting to load AI models...');
      
      // Test connection first with a simple request
      const testResponse = await fetch('https://huggingface.co/api/models/Xenova/distilbert-base-uncased-finetuned-sst-2-english', {
        method: 'HEAD',
        headers: HF_TOKEN ? { 'Authorization': `Bearer ${HF_TOKEN}` } : {}
      });

      if (!testResponse.ok) {
        throw new Error(`Model access test failed: ${testResponse.status}`);
      }

      const modelOptions = {
        ...(HF_TOKEN && { 
          use_auth_token: HF_TOKEN,
          headers: { 'Authorization': `Bearer ${HF_TOKEN}` }
        }),
        // Add timeout and retry options
        timeout: 30000,
        retry: 2
      };

      // Try to load just one lightweight model first
      console.log('Loading sentiment analysis model...');
      const sentiment = await Promise.race([
        pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', modelOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Model loading timeout')), 30000))
      ]) as Pipeline;

      // If successful, try to load the embedder
      console.log('Loading text embedder model...');
      const embedder = await Promise.race([
        pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', modelOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Embedder loading timeout')), 30000))
      ]) as Pipeline;

      this.models = {
        classifier: sentiment, // Use sentiment model for classification too
        embedder,
        sentiment,
        ner: null, // Skip complex models
        summarizer: null
      };

      this.fallbackMode = false;
      console.log('AI models loaded successfully');
    } catch (error) {
      console.error('Failed to load AI models:', error);
      this.fallbackMode = true;
      throw error;
    }
  }

  async classifyIntent(text: string): Promise<{
    intent: string;
    confidence: number;
    category: string;
  } | null> {
    if (this.fallbackMode || !this.models.classifier) {
      return this.fallbackClassifyIntent(text);
    }

    try {
      const result = await this.models.classifier!(text);
      const topResult = Array.isArray(result) ? result[0] : result;
      
      // Map sentiment to service categories
      const category = this.mapToServiceCategory(text, topResult.label);
      
      return {
        intent: topResult.label,
        confidence: topResult.score,
        category
      };
    } catch (error) {
      console.error('Intent classification failed:', error);
      return this.fallbackClassifyIntent(text);
    }
  }

  async generateEmbedding(text: string): Promise<number[] | null> {
    if (this.fallbackMode || !this.models.embedder) {
      return this.fallbackGenerateEmbedding(text);
    }

    try {
      const result = await this.models.embedder!(text, { 
        pooling: 'mean', 
        normalize: true 
      });
      return Array.from(result.data);
    } catch (error) {
      console.error('Embedding generation failed:', error);
      return this.fallbackGenerateEmbedding(text);
    }
  }

  async analyzeSentiment(text: string): Promise<{
    sentiment: string;
    confidence: number;
    urgency: 'low' | 'medium' | 'high';
  } | null> {
    if (this.fallbackMode || !this.models.sentiment) {
      return this.fallbackAnalyzeSentiment(text);
    }

    try {
      const result = await this.models.sentiment!(text);
      const topResult = Array.isArray(result) ? result[0] : result;
      
      // Determine urgency based on sentiment and keywords
      const urgency = this.determineUrgency(text, topResult.score);
      
      return {
        sentiment: topResult.label,
        confidence: topResult.score,
        urgency
      };
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return this.fallbackAnalyzeSentiment(text);
    }
  }

  async extractEntities(text: string): Promise<{
    entities: Array<{
      entity: string;
      label: string;
      confidence: number;
      start: number;
      end: number;
    }>;
    skills: string[];
    location?: string;
  } | null> {
    // Always use fallback for entity extraction since NER models are complex
    return this.fallbackExtractEntities(text);
  }

  async summarizeText(text: string, maxLength = 50): Promise<string | null> {
    // Always use simple truncation since summarization models are large
    return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) return 0;
    
    const dotProduct = embedding1.reduce((sum, a, i) => sum + a * embedding2[i], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, a) => sum + a * a, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, a) => sum + a * a, 0));
    
    return dotProduct / (magnitude1 * magnitude2);
  }

  async intelligentMatch(
    query: string, 
    providers: any[]
  ): Promise<Array<any & { aiScore: number; matchReasons: string[] }>> {
    try {
      // Always use fallback matching for reliability
      return this.fallbackIntelligentMatch(query, providers);
    } catch (error) {
      console.error('Intelligent matching failed:', error);
      return this.fallbackIntelligentMatch(query, providers);
    }
  }

  // Enhanced fallback methods
  private fallbackClassifyIntent(text: string): {
    intent: string;
    confidence: number;
    category: string;
  } {
    const category = this.mapToServiceCategory(text, 'NEUTRAL');
    
    // Simple sentiment analysis based on keywords
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'perfect', 'love', 'best'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'problem'];
    
    const textLower = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
    
    let intent = 'NEUTRAL';
    let confidence = 0.6;
    
    if (positiveCount > negativeCount) {
      intent = 'POSITIVE';
      confidence = Math.min(0.8, 0.6 + (positiveCount * 0.1));
    } else if (negativeCount > positiveCount) {
      intent = 'NEGATIVE';
      confidence = Math.min(0.8, 0.6 + (negativeCount * 0.1));
    }
    
    return { intent, confidence, category };
  }

  private fallbackGenerateEmbedding(text: string): number[] {
    // Enhanced hash-based embedding with better distribution
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const embedding = new Array(384).fill(0);
    
    // Use word-based features for better semantic representation
    words.forEach((word, wordIndex) => {
      const wordHash = this.simpleHash(word);
      for (let i = 0; i < 384; i++) {
        const feature = Math.sin(wordHash + i + wordIndex) * 0.1;
        embedding[i] += feature / words.length; // Average across words
      }
    });
    
    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] /= magnitude;
      }
    }
    
    return embedding;
  }

  private fallbackAnalyzeSentiment(text: string): {
    sentiment: string;
    confidence: number;
    urgency: 'low' | 'medium' | 'high';
  } {
    const urgency = this.determineUrgency(text, 0.5);
    
    // Enhanced sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'perfect', 'love', 'best', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'problem', 'issue', 'broken'];
    
    const textLower = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
    
    let sentiment = 'NEUTRAL';
    let confidence = 0.5;
    
    if (positiveCount > negativeCount) {
      sentiment = 'POSITIVE';
      confidence = Math.min(0.9, 0.6 + (positiveCount * 0.1));
    } else if (negativeCount > positiveCount) {
      sentiment = 'NEGATIVE';
      confidence = Math.min(0.9, 0.6 + (negativeCount * 0.1));
    }
    
    return { sentiment, confidence, urgency };
  }

  private fallbackExtractEntities(text: string): {
    entities: Array<{
      entity: string;
      label: string;
      confidence: number;
      start: number;
      end: number;
    }>;
    skills: string[];
    location?: string;
  } {
    const skills = this.extractSkills(text, []);
    const location = this.extractLocation(text);
    
    return {
      entities: [],
      skills,
      location
    };
  }

  private fallbackIntelligentMatch(
    query: string,
    providers: any[]
  ): Array<any & { aiScore: number; matchReasons: string[] }> {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    
    return providers.map(provider => {
      let score = 0;
      const matchReasons: string[] = [];
      
      // Enhanced keyword matching with weights
      const providerText = `${provider.title || ''} ${provider.description || ''} ${(provider.skills || []).join(' ')}`.toLowerCase();
      
      // Exact phrase matching (highest weight)
      if (providerText.includes(queryLower)) {
        score += 0.4;
        matchReasons.push('Exact phrase match');
      }
      
      // Individual word matching
      const wordMatches = queryWords.filter(word => providerText.includes(word));
      const wordScore = wordMatches.length / Math.max(queryWords.length, 1) * 0.3;
      score += wordScore;
      
      if (wordMatches.length > 0) {
        matchReasons.push(`Matches ${wordMatches.length}/${queryWords.length} keywords`);
      }
      
      // Skill-specific matching
      const providerSkills = (provider.skills || []).map((s: string) => s.toLowerCase());
      const skillMatches = queryWords.filter(word => 
        providerSkills.some(skill => skill.includes(word) || word.includes(skill))
      );
      
      if (skillMatches.length > 0) {
        score += skillMatches.length * 0.1;
        matchReasons.push(`Skill matches: ${skillMatches.join(', ')}`);
      }
      
      // Rating boost
      const rating = provider.rating || 0;
      score += (rating / 5) * 0.15;
      if (rating >= 4.5) matchReasons.push('Highly rated (4.5+)');
      
      // Availability boost
      if (provider.availability === 'available') {
        score += 0.1;
        matchReasons.push('Available now');
      }
      
      // Experience boost
      if (provider.experience_years && provider.experience_years > 3) {
        score += 0.05;
        matchReasons.push(`${provider.experience_years}+ years experience`);
      }
      
      return {
        ...provider,
        aiScore: Math.min(score, 1),
        matchReasons: matchReasons.length > 0 ? matchReasons : ['Basic match']
      };
    }).sort((a, b) => b.aiScore - a.aiScore);
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private mapToServiceCategory(text: string, sentiment: string): string {
    const categories = {
      'web development': ['website', 'web', 'react', 'javascript', 'frontend', 'backend', 'app', 'application', 'coding', 'programming'],
      'design': ['design', 'graphic', 'logo', 'ui', 'ux', 'branding', 'creative', 'visual', 'photoshop', 'illustrator'],
      'home services': ['plumber', 'electrician', 'repair', 'fix', 'install', 'maintenance', 'home', 'house', 'cleaning', 'gardening'],
      'fitness': ['trainer', 'fitness', 'workout', 'gym', 'exercise', 'health', 'nutrition', 'yoga', 'pilates'],
      'education': ['tutor', 'teach', 'learn', 'lesson', 'course', 'education', 'training', 'coaching', 'mentoring'],
      'business': ['consultant', 'marketing', 'strategy', 'business', 'sales', 'management', 'accounting', 'finance'],
      'writing': ['writer', 'content', 'copywriting', 'blog', 'article', 'documentation', 'editing', 'proofreading'],
      'photography': ['photographer', 'photo', 'photography', 'video', 'videography', 'filming', 'editing']
    };

    const textLower = text.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        return category;
      }
    }

    return 'general';
  }

  private determineUrgency(text: string, confidence: number): 'low' | 'medium' | 'high' {
    const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediately', 'now', 'today', 'critical', 'help', 'quick'];
    const mediumKeywords = ['soon', 'this week', 'quickly', 'fast', 'need', 'require', 'important'];
    
    const textLower = text.toLowerCase();
    
    if (urgentKeywords.some(keyword => textLower.includes(keyword))) {
      return 'high';
    }
    
    if (mediumKeywords.some(keyword => textLower.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }

  private extractSkills(text: string, entities: any[]): string[] {
    const skillKeywords = [
      // Tech skills
      'react', 'javascript', 'python', 'java', 'php', 'node.js', 'angular', 'vue',
      'html', 'css', 'typescript', 'sql', 'mongodb', 'aws', 'docker', 'kubernetes',
      'flutter', 'swift', 'kotlin', 'c++', 'c#', 'ruby', 'go', 'rust',
      // Design skills
      'design', 'photoshop', 'illustrator', 'figma', 'sketch', 'ui', 'ux',
      'adobe', 'canva', 'indesign', 'after effects', 'premiere',
      // Home services
      'plumbing', 'electrical', 'carpentry', 'painting', 'cleaning', 'gardening',
      'hvac', 'roofing', 'flooring', 'tiling', 'masonry',
      // Other skills
      'fitness', 'training', 'teaching', 'marketing', 'consulting', 'writing',
      'photography', 'video editing', 'accounting', 'legal', 'translation',
      'music', 'singing', 'dancing', 'cooking', 'baking'
    ];
    
    const textLower = text.toLowerCase();
    const extractedSkills = skillKeywords.filter(skill => 
      textLower.includes(skill)
    );
    
    return [...new Set(extractedSkills)]; // Remove duplicates
  }

  private extractLocation(text: string): string | undefined {
    // Simple location extraction based on common patterns
    const locationPatterns = [
      /in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
      /at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
      /near\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    ];
    
    for (const pattern of locationPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        return matches[0].replace(/^(in|at|near)\s+/, '');
      }
    }
    
    return undefined;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  isFallbackMode(): boolean {
    return this.fallbackMode;
  }

  getModelStatus(): {
    initialized: boolean;
    fallbackMode: boolean;
    hasToken: boolean;
    loadedModels: string[];
    tokenValid: boolean;
  } {
    const loadedModels = Object.entries(this.models)
      .filter(([_, model]) => model !== null)
      .map(([name, _]) => name);

    const tokenValid = HF_TOKEN && HF_TOKEN !== 'your_huggingface_token_here' && HF_TOKEN.length > 10;

    return {
      initialized: this.initialized,
      fallbackMode: this.fallbackMode,
      hasToken: !!HF_TOKEN,
      tokenValid: !!tokenValid,
      loadedModels
    };
  }
}

// Export singleton instance
export const aiService = new AIService();

// Legacy exports for backward compatibility
export const initializeAI = () => aiService.initialize();
export const classifyIntent = (text: string) => aiService.classifyIntent(text);
export const generateEmbedding = (text: string) => aiService.generateEmbedding(text);
export const calculateSimilarity = (emb1: number[], emb2: number[]) => aiService.calculateSimilarity(emb1, emb2);