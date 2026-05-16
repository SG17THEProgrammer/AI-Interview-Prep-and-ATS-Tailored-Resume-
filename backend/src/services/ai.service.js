import { z } from "zod";
import puppeteer from "puppeteer";
import OpenAI from "openai";
import JSON5 from 'json5';
import { jsonrepair } from "jsonrepair";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// -------------------- Schemas --------------------
const interviewReportSchema = z.object({
 matchScore: z.number().min(0).max(100),
  decision: z.enum(["APPLY", "SKIP" ,"MAYBE"]),
    fit: z.object({
    matches: z.array(z.string()).default([]),
    gaps: z.array(z.string()).default([]),
  }),
    resumeChanges: z.array(
    z.object({
      before: z.string(),
      after: z.string(),
    })
  ).default([]),
   criticalGaps: z.array(z.string()).default([]),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ).default([]),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ).default([]),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ).default([]),
  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()).default([]),
    })
  ).default([]),
  title: z.string(),
});

const resumePdfSchema = z.object({
  html: z.string(),
});

// -------------------- Helper: Generate PDF --------------------
async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
  });

  await browser.close();
  return pdfBuffer;
}

// -------------------- Generate Interview Report --------------------
export async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
 const system_prompt = `
You are an expert ATS resume evaluator and interview preparation assistant for tech roles.
You evaluate candidates strictly and generate structured interview preparation output.
Also you provide certains changes according to the job description which helps candidates to get their resume shortlisted according to ATS. 
---

## CORE TASKS
1. Evaluate job fit
2. Decide APPLY or SKIP or MAYBE
3. Suggest safe resume improvements (no hallucination)
4. Generate interview preparation report in strict JSON format

---

## DECISION RULE (ABSOLUTE)

- Score is between 0 and 100
- Score ≥ 80 → APPLY
- 50 <= Score < 80 → MAYBE
- Score < 50 → SKIP

DO NOT override this rule.

---

## STRICT RULES

- Do NOT invent skills or experience
- Do NOT assume technologies not present in resume
- Do NOT rewrite full resume
- Only suggest improvements based on existing content
- Be realistic and strict (no bias)

---

## OUTPUT RULE (VERY IMPORTANT)

You MUST return ONLY valid JSON.
No explanation, no markdown, no extra text.
JSON must be strictly valid. No trailing commas, no extra quotes, no comments, no unescaped characters. Every string must be properly closed. Do not approximate JSON.

The JSON must exactly follow the required schema provided in the user message.

---

## INTERVIEW QUALITY RULES

- Technical questions must be relevant to job role
- Behavioral questions must test real-world experience
- Answers must be structured and actionable
- Skill gaps must be meaningful (no fluff)
- Preparation plan must be day-wise and practical

---

## FORMATTING RULES

- "day" must always be a number starting from 1
- No strings like "Day 1"
- Arrays must never be null (use empty array if none)

---
`;

const user_prompt = `
Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

---

Return JSON matching this exact structure:

{
  "title": string,
  "matchScore": number,
  "decision": "APPLY" | "SKIP" | "MAYBE"",
  "fit": {
    "matches": string[],
    "gaps": string[]
  },
  "resumeChanges": [
    {
      "before": string,
      "after": string
    }
  ],
  "criticalGaps": string[],
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": string[]
    }
  ]
}
`;

  const response = await client.responses.create({
    model: "groq/compound-mini",
    input: [
        { role: "system", content: system_prompt },
        { role: "user", content: user_prompt },

    ],
  });

  const outputText = response.output_text || response.output?.[0]?.content?.[0]?.text;
  // Parse JSON safely
  const parsed = extractJson(outputText);
  //   const parsed = JSON.parse(outputText);
  return interviewReportSchema.parse(parsed);
}

// -------------------- Generate Resume PDF --------------------
export async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const prompt = `
Generate a resume in HTML format for a candidate with the following details:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return a JSON object with a single field "html" containing the HTML content of the resume.
The resume should:
- Be ATS-friendly
- Tailored to the job description
- Highlight candidate strengths
- Be professional and visually appealing
- 1-2 pages when converted to PDF

The output MUST be valid JSON only, without extra text.
`;

  const response = await client.responses.create({
    model: "llama-3.3-70b-versatile",
    input: [{ role: "user", content: prompt }],
  });

  const outputText = response.output_text || response.output?.[0]?.content?.[0]?.text;
//   const jsonContent = JSON.parse(outputText);
  const jsonContent = extractJson(outputText);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
  return pdfBuffer;
}


function extractJson(text) {
  try {
    let cleaned = text.trim()
      .replace(/^```(json)?\s*/, '')
      .replace(/```$/, '')
      .trim();

    const repaired = jsonrepair(cleaned);
    return JSON.parse(repaired);

  } catch (err) {
    console.error("Failed to parse AI output:", text);
    throw err;
  }
}