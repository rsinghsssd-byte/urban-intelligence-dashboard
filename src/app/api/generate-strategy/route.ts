import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { unservedAreas, city } = await req.json();

    const mockStrategies = [
      {
        tag: 'High Priority',
        tagColor: 'badge-red',
        title: `Whitefield - Mobile Clinic Deployment`,
        description: `Deploy 2 mobile health units to high-density zones in Whitefield to reduce median commute distance to clinical care.`,
        impactScore: 8.4,
        info: '+3 Units'
      },
      {
        tag: 'Incentive Plan',
        tagColor: 'badge-teal',
        title: `Bangalore E-Zone - Pharmacy Incentives`,
        description: `Implement tax breaks for pharmacies operating 24/7 in unserved sectors around Whitefield.`,
        impactScore: 7.9,
        info: '12.5% Tax Rebate'
      }
    ];

    if (!process.env.GEMINI_API_KEY) {
      console.log('No GEMINI_API_KEY found. Returning mock strategies.');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI delay
      return NextResponse.json({ strategies: mockStrategies });
    }

    if (!unservedAreas || unservedAreas.length === 0) {
      return NextResponse.json(
        { response: 'No unserved areas detected. Current infrastructure coverage is sufficient based on the selected parameters.' }
      );
    }

    const unservedCount = unservedAreas.length;
    
    // Formatting a quick summary of the worst unserved areas for the prompt
    // To save token context, we just send a statistical summary instead of all raw coordinates
    const maxGap = Math.max(...unservedAreas.map((a: any) => a.distanceToNearest));
    const avgGap = unservedAreas.reduce((acc: number, a: any) => acc + a.distanceToNearest, 0) / unservedCount;

    const prompt = `
      You are an expert Urban Planner and City Strategist analyzing AI-driven infrastructure data for ${city || 'the city'}.
      
      Our spatial analysis system has just identified ${unservedCount} specific "Unserved Zones" (1km² grid blocks) that categorically lack both a Hospital and a School within a 3km radius.
      - The worst unserved zone is ${maxGap.toFixed(1)}km away from the nearest core service.
      - The average distance to a core service across these unserved zones is ${avgGap.toFixed(1)}km.

      Your task is to generate 2 highly specific, actionable, and innovative urban planning strategies to resolve these unserved areas. 

      Return your response STRICTLY as a JSON array containing exactly 2 objects. Do NOT wrap the JSON in markdown code blocks.
      Each object must match this exact structure:
      {
        "tag": "String (e.g., 'High Priority', 'Policy Shift', 'Transit Expansion')",
        "tagColor": "String (must be exactly 'badge-red', 'badge-teal', or 'badge-orange')",
        "title": "String (A catchy title for the strategy, mentioning ${city || 'the city'} context)",
        "description": "String (A 2-3 sentence actionable description of what should be done)",
        "impactScore": "Number (Between 6.0 and 9.9)",
        "info": "String (A short micro-stat or timeline, e.g., '6 Month Rollout' or 'Phase 1')"
      }
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    const aiText = response.text || '';
    
    // Attempt to parse the AI JSON output
    let parsedStrategies;
    try {
      // Strip any potential markdown formatting the AI might add despite instructions
      const cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedStrategies = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse Gemini output as JSON:', aiText);
      // Fallback strategies if the AI fails to return valid JSON
      parsedStrategies = mockStrategies;
    }

    return NextResponse.json({ strategies: parsedStrategies });

  } catch (error) {
    console.error('Strategy Generation API Error:', error);
    return NextResponse.json({ error: 'Failed to generate strategy' }, { status: 500 });
  }
}
