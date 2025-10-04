import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Analyzing image with AI vision...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a medication verification assistant. Analyze images to determine if someone is taking medicine. 
            Look for:
            - Pills, tablets, capsules, or liquid medication
            - A person holding or about to take medication
            - Medicine near a person's mouth or in their hand
            
            Respond with a JSON object containing:
            - verified: boolean (true if medicine taking is clearly visible)
            - confidence: number (0-100, how confident you are)
            - details: string (brief description of what you see)
            
            Be strict - only verify if you clearly see medication being taken.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Is this person taking their medicine? Analyze the image carefully.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    // Parse the AI response to extract verification result
    let result;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: analyze text response
        const verified = aiResponse.toLowerCase().includes('yes') || 
                        aiResponse.toLowerCase().includes('verified') ||
                        aiResponse.toLowerCase().includes('taking medicine');
        result = {
          verified,
          confidence: verified ? 75 : 25,
          details: aiResponse
        };
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      result = {
        verified: false,
        confidence: 0,
        details: aiResponse
      };
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in verify-medicine function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        verified: false,
        confidence: 0,
        details: 'Failed to analyze image'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
