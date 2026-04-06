'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are an intelligent internal ticket triage system. Analyze the employee's ticket and return a JSON object with EXACTLY the following structure. Do not include markdown formatting or backticks around the JSON.
{
  "category": "Billing" | "Bug" | "Access" | "HR" | "Server" | "DB" | "Feature" | "Other",
  "aiSummary": "2-3 sentence summary of the issue.",
  "severity": "Critical" | "High" | "Medium" | "Low",
  "resolutionPath": "Auto-resolve" | "Assign to department",
  "sentiment": "Frustrated" | "Neutral" | "Polite",
  "suggestedDepartment": "Engineering" | "DevOps" | "IT" | "HR" | "Finance" | "Product" | "Marketing" | "Legal" | null,
  "confidenceScore": number (0-100),
  "estimatedResolutionTime": number (in minutes),
  "autoResponse": "Professional response if auto-resolving, addressing their issue directly. If assigning to department, leave this empty."
}

Rules for Auto-resolve: If the ticket is about password resets, general HR policies (leave application), standard tool access, or simple status checks, set resolutionPath to "Auto-resolve" and provide a helpful autoResponse. Otherwise, set it to "Assign to department".
Priorities: DB/Server down = Critical. Access = High. Legal = High. Bug = Depends on severity.
`;

export async function submitTicket(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!title || !description) throw new Error("Title and description are required.");

  try {
    let aiOutput;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${SYSTEM_PROMPT}\n\nTicket Title: ${title}\nTicket Description: ${description}`,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      aiOutput = JSON.parse(responseText);
    } catch (e) {
      console.error("AI Analysis failed:", e);
      // Fallback if AI fails or no key
      aiOutput = {
        category: "Other",
        aiSummary: "AI analysis failed due to missing API key or network error.",
        severity: "Medium",
        resolutionPath: "Assign to department",
        sentiment: "Neutral",
        suggestedDepartment: "IT",
        confidenceScore: 0,
        estimatedResolutionTime: 120,
        autoResponse: ""
      };
    }

    let assigneeId = null;
    let departmentId = null;
    let status = "New";

    if (aiOutput.resolutionPath === "Assign to department" && aiOutput.suggestedDepartment) {
      // Find the department
      const dept = await prisma.department.findUnique({
        where: { name: aiOutput.suggestedDepartment }
      });

      if (dept) {
        departmentId = dept.id;
        // Find best assignee
        const candidates = await prisma.employee.findMany({
          where: {
            departmentId: dept.id,
            availability: { not: "On Leave" } // only Available or Busy
          },
          orderBy: [
            { currentLoad: 'asc' }, // Lowest load first
            { availability: 'asc' } // Available before Busy
          ]
        });

        if (candidates.length > 0) {
          assigneeId = candidates[0].id;
          status = "Assigned";
          
          // Increment assignee load
          await prisma.employee.update({
            where: { id: assigneeId },
            data: { currentLoad: { increment: 1 } }
          });
        }
      }
    } else if (aiOutput.resolutionPath === "Auto-resolve") {
      status = "Resolved"; // Auto-resolved
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        category: aiOutput.category,
        aiSummary: aiOutput.aiSummary,
        severity: aiOutput.severity,
        resolutionPath: aiOutput.resolutionPath,
        sentiment: aiOutput.sentiment,
        confidenceScore: aiOutput.confidenceScore,
        estimatedResolutionTime: aiOutput.estimatedResolutionTime,
        status: status,
        departmentId: departmentId,
        assigneeId: assigneeId,
        autoResponse: aiOutput.autoResponse || null,
        aiAnalysisRaw: JSON.stringify(aiOutput)
      }
    });

    revalidatePath('/');
    revalidatePath('/tickets');
    revalidatePath('/employees');

    return { success: true, ticketId: ticket.id, autoResolved: aiOutput.resolutionPath === "Auto-resolve" };

  } catch (error) {
    console.error("Failed to submit ticket", error);
    return { success: false, error: "Database error." };
  }
}

export async function submitFeedback(ticketId: string, isHelpful: boolean) {
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { userFeedbackIsHelpful: isHelpful }
  });
  revalidatePath('/');
  revalidatePath('/tickets');
}

export async function processAction(ticketId: string, actionUrl: string) {
    // a placeholder for a status update
    revalidatePath('/tickets');
}
