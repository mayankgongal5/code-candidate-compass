import OpenAI from 'openai';

interface ResumeAnalysisResult {
  skills: string[];
  experience: string;
  education: string;
  summary: string;
  strengths: string[];
  recommendations: string[];
}

// Helper function to extract text from PDF
const extractTextFromPDF = async (file: File): Promise<string> => {
  // For now, return a placeholder - in production, you'd use a PDF parsing library like pdf-parse
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // This is a simplified version - you'd need a proper PDF parser
      resolve("Sample extracted text from PDF for analysis...");
    };
    reader.readAsText(file);
  });
};

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true // Only for demo - in production, use backend
});

export const analyzeResumeWithChatGPT = async (file: File): Promise<ResumeAnalysisResult> => {
  try {
    // Convert PDF to text
    const text = await extractTextFromPDF(file);
    
    // In a real implementation, you would call OpenAI's ChatGPT API here
    // For now, we'll return mock data
    const mockAnalysis: ResumeAnalysisResult = {
      skills: [
        "JavaScript", "React", "Node.js", "TypeScript", "Python", 
        "SQL", "Git", "Docker", "AWS", "MongoDB"
      ],
      experience: "5+ years of full-stack development experience with modern web technologies. Proven track record of building scalable applications and leading development teams.",
      education: "Bachelor's degree in Computer Science from a recognized university. Additional certifications in cloud computing and agile methodologies.",
      summary: "Experienced software developer with strong technical skills and leadership capabilities. Demonstrated ability to deliver high-quality solutions in fast-paced environments.",
      strengths: [
        "Strong technical expertise in modern web development",
        "Excellent problem-solving and analytical skills",
        "Proven leadership and team collaboration abilities",
        "Experience with cloud platforms and DevOps practices"
      ],
      recommendations: [
        "Consider for senior developer or technical lead positions",
        "Strong candidate for full-stack development roles",
        "Would benefit team with both technical and leadership skills"
      ]
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return mockAnalysis;
  } catch (error) {
    console.error("Resume analysis failed:", error);
    throw new Error("Failed to analyze resume");
  }
};
