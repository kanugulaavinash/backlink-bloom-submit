import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AIDetectionRequest {
  postId: string;
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postId, content }: AIDetectionRequest = await req.json();
    
    // Initialize Supabase client with service role for database writes
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log(`Starting AI content detection for post: ${postId}`);

    // Real AI content detection implementation
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const words = content.split(/\s+/);
    const totalSentences = sentences.length;
    const totalWords = words.length;
    
    const highlights: any[] = [];
    let aiScore = 0;

    // 1. Lexical diversity analysis
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const lexicalDiversity = uniqueWords.size / totalWords;
    
    // AI-generated content typically has lower lexical diversity
    if (lexicalDiversity < 0.5) {
      aiScore += 15;
    } else if (lexicalDiversity < 0.6) {
      aiScore += 8;
    }

    // 2. Sentence length and variation analysis
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const sentenceLengthVariance = sentenceLengths.reduce((sum, len) => {
      return sum + Math.pow(len - avgSentenceLength, 2);
    }, 0) / sentenceLengths.length;

    // AI often generates very uniform sentence lengths
    if (sentenceLengthVariance < 20) {
      aiScore += 12;
    }

    // 3. Common AI phrases and patterns
    const aiIndicators = [
      /as an ai/i,
      /i don't have personal/i,
      /i cannot provide/i,
      /it's worth noting/i,
      /furthermore/gi,
      /additionally/gi,
      /in conclusion/gi,
      /\b(overall|ultimately|essentially|basically)\b/gi
    ];

    let aiPhraseCount = 0;
    for (const pattern of aiIndicators) {
      const matches = content.match(pattern);
      if (matches) {
        aiPhraseCount += matches.length;
      }
    }

    if (aiPhraseCount > 3) {
      aiScore += Math.min(aiPhraseCount * 3, 20);
    }

    // 4. Repetitive word usage analysis
    const wordCounts = new Map<string, number>();
    for (const word of words) {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (cleanWord.length > 3) {
        wordCounts.set(cleanWord, (wordCounts.get(cleanWord) || 0) + 1);
      }
    }

    let repetitiveScore = 0;
    for (const [word, count] of wordCounts) {
      if (count > totalWords * 0.02) { // Word appears more than 2% of the time
        repetitiveScore += count;
      }
    }

    if (repetitiveScore > totalWords * 0.1) {
      aiScore += 10;
    }

    // 5. Perplexity approximation (simple version)
    // AI-generated text often has lower perplexity (more predictable)
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const commonWordRatio = words.filter(w => 
      commonWords.includes(w.toLowerCase())
    ).length / totalWords;

    if (commonWordRatio > 0.4) { // Very high common word usage
      aiScore += 8;
    }

    // 6. Find suspicious sentences for highlighting
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      const sentenceWords = sentence.split(/\s+/);
      
      let suspicionScore = 0;
      
      // Check for AI indicators in this sentence
      for (const pattern of aiIndicators) {
        if (pattern.test(sentence)) {
          suspicionScore += 0.3;
        }
      }
      
      // Check sentence characteristics
      const sentenceLexicalDiversity = new Set(sentenceWords.map(w => w.toLowerCase())).size / sentenceWords.length;
      if (sentenceLexicalDiversity < 0.5) {
        suspicionScore += 0.2;
      }
      
      // Very generic or templated sentences
      if (/^(this|these|that|those|the|in|on|at)\s+/i.test(sentence) && sentenceWords.length > 15) {
        suspicionScore += 0.2;
      }
      
      if (suspicionScore > 0.4) {
        highlights.push({
          sentence_index: i,
          text: sentence,
          confidence: Math.min(suspicionScore, 0.95),
          reason: suspicionScore > 0.6 ? "High AI generation probability" : "Moderate AI generation indicators",
          factors: {
            lexical_diversity: sentenceLexicalDiversity,
            ai_phrases: aiIndicators.some(p => p.test(sentence)),
            generic_structure: /^(this|these|that|those|the|in|on|at)\s+/i.test(sentence)
          }
        });
      }
    }

    // Cap the final score
    aiScore = Math.min(aiScore, 100);

    console.log(`AI detection complete. Score: ${aiScore.toFixed(2)}%, Lexical diversity: ${lexicalDiversity.toFixed(3)}, Highlights: ${highlights.length}`);

    const validationStatus = aiScore > 30 ? 'failed' : 'passed';
    
    // Store results in database with proper conflict resolution
    const { error: upsertError } = await supabaseService
      .from('validation_results')
      .upsert({
        post_id: postId,
        ai_content_score: Math.round(aiScore * 100) / 100,
        ai_content_highlights: highlights,
        ai_detection_details: {
          total_sentences: totalSentences,
          total_words: totalWords,
          lexical_diversity: Math.round(lexicalDiversity * 1000) / 1000,
          avg_sentence_length: Math.round(avgSentenceLength * 100) / 100,
          sentence_variance: Math.round(sentenceLengthVariance * 100) / 100,
          ai_phrase_count: aiPhraseCount,
          common_word_ratio: Math.round(commonWordRatio * 1000) / 1000,
          analysis_model: "Real AI Detection v1.0",
          detection_methods: ["lexical_diversity", "sentence_analysis", "ai_patterns", "repetition_analysis", "perplexity_approximation"],
          scan_date: new Date().toISOString()
        },
        validation_status: validationStatus,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'post_id'
      });

    if (upsertError) {
      console.error('Error storing AI detection results:', upsertError);
      throw new Error(`Failed to store validation results: ${upsertError.message}`);
    }

    console.log(`AI detection completed. Score: ${aiScore}%, Status: ${validationStatus}`);

    return new Response(JSON.stringify({
      success: true,
      ai_score: Math.round(aiScore * 100) / 100,
      highlights,
      status: validationStatus,
      total_sentences: totalSentences
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('AI detection error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});