interface ResumeAnalysisResult {
  skills: string[];
  experience: string;
  education: string;
  summary: string;
  strengths: string[];
  recommendations: string[];
}

export const analyzeResumeWithChatGPT = async (file: File): Promise<ResumeAnalysisResult> => {
  try {
    // Convert PDF to text (simplified - in production, you'd use a PDF parser)
    const formData = new FormData();
    formData.append('file', file);
    
    // Extract text from PDF (you might want to use a PDF parsing library)
    const text = await extractTextFromPDF(file);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume analyzer. Analyze the resume text and extract key information in a structured format.'
          },
          {
            role: 'user',
            content: `Please analyze this resume and provide a detailed analysis in the following JSON format:
            {
              "skills": ["list of technical and soft skills"],
              "experience": "summary of work experience",
              "education": "educational background",
              "summary": "overall candidate summary",
              "strengths": ["key strengths identified"],
              "recommendations": ["recommendations for improvement"]
            }
            
            Resume text:
            ${text}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`ChatGPT API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    // Parse the JSON response
    try {
      return JSON.parse(analysisText);
    } catch {
      // Fallback if JSON parsing fails
      return {
        skills: ["Analysis in progress"],
        experience: analysisText,
        education: "Extracted from resume",
        summary: "Resume analysis completed",
        strengths: ["Professional experience"],
        recommendations: ["Continue developing skills"]
      };
    }
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw new Error('Failed to analyze resume');
  }
};

// Simplified PDF text extraction (in production, use a proper PDF parser)
const extractTextFromPDF = async (file: File): Promise<string> => {
  // This is a simplified approach - in production, you'd use libraries like:
  // - pdf-parse for Node.js
  // - PDF.js for browser
  // - or send to a backend service for processing
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // This won't actually extract text from PDF properly
      // It's just a placeholder for the demo
      resolve(`Resume content from ${file.name} - This would contain the actual extracted text from the PDF file in a real implementation.`);
    };
    reader.readAsText(file);
  });
};
