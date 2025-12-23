import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProfileData {
  educationLevel: string;
  skills: string[];
  interests: string[];
  preferredIndustries: string[];
  careerGoals: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profile } = await req.json() as { profile: ProfileData };
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating recommendations for profile:", JSON.stringify(profile));

    const systemPrompt = `You are an expert career counselor and AI career guidance system. Based on the user's profile, provide personalized career recommendations.

You must respond with a valid JSON object containing exactly this structure:
{
  "recommendations": [
    {
      "title": "Career Title",
      "description": "Brief description of the career (2-3 sentences)",
      "requiredSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
      "nextSteps": {
        "courses": ["Course 1", "Course 2"],
        "certifications": ["Certification 1", "Certification 2"],
        "practiceAreas": ["Practice Area 1", "Practice Area 2"]
      },
      "matchScore": 85
    }
  ],
  "skillGapAnalysis": [
    {
      "careerTitle": "Career Title",
      "missingSkills": ["skill1", "skill2"],
      "presentSkills": ["skill3", "skill4"]
    }
  ],
  "learningRoadmap": [
    {
      "level": "Beginner",
      "skills": ["skill1", "skill2", "skill3"],
      "estimatedTime": "2-3 months",
      "description": "Foundation skills to get started"
    },
    {
      "level": "Intermediate",
      "skills": ["skill4", "skill5", "skill6"],
      "estimatedTime": "4-6 months",
      "description": "Core competencies for the field"
    },
    {
      "level": "Advanced",
      "skills": ["skill7", "skill8", "skill9"],
      "estimatedTime": "6-12 months",
      "description": "Expert-level specializations"
    }
  ]
}

Provide 3-5 career recommendations sorted by matchScore (highest first).
Match scores should be realistic (60-95%) based on how well the user's profile matches.
The skillGapAnalysis should compare user's current skills with each recommended career.
The learningRoadmap should provide a clear progression path for the top career choice.
Be specific and actionable with courses, certifications, and practice areas.`;

    const userPrompt = `Please analyze this user profile and provide career recommendations:

Education Level: ${profile.educationLevel || "Not specified"}
Current Skills: ${profile.skills?.length > 0 ? profile.skills.join(", ") : "None specified"}
Interests: ${profile.interests?.length > 0 ? profile.interests.join(", ") : "None specified"}
Preferred Industries: ${profile.preferredIndustries?.length > 0 ? profile.preferredIndustries.join(", ") : "Open to all"}
Career Goals: ${profile.careerGoals || "Not specified"}

Provide personalized career path recommendations based on this profile.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits required. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("Raw AI response:", content);

    // Parse the JSON from the response
    let parsedContent;
    try {
      // Try to extract JSON from the response (in case it's wrapped in markdown)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        parsedContent = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Failed to parse AI response as JSON");
    }

    console.log("Parsed recommendations:", JSON.stringify(parsedContent));

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-career-recommendations:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
