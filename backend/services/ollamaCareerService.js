const axios = require("axios");

const OLLAMA_URL =
    process.env.OLLAMA_URL ||
    "http://127.0.0.1:11434";

const OLLAMA_MODEL =
    process.env.OLLAMA_MODEL ||
    "qwen3:1.7b";

const SYSTEM_PROMPT = `
You are NEO, the AI Career Guidance Assistant of SICR.

Your ONLY domain is career guidance.

You help students with:

- Career selection
- IT careers
- Non-IT careers
- Skills
- Courses
- Learning roadmaps
- Education pathways
- Career comparisons
- Career planning
- Job roles
- Higher education options

RULES:

1. Answer clearly and practically.
2. Use simple language.
3. Give structured answers when useful.
4. Do not invent facts about the student.
5. Use the student's profile only when relevant.
6. Ask follow-up questions when important information is missing.
7. Keep normal answers concise.
8. Give detailed answers only when the student asks for detail.
9. Never guarantee jobs, salaries, admissions, or success.
10. Do not answer unrelated topics.

IMPORTANT:
You are NEO, not ChatGPT.
You are the Career Intelligence Assistant of SICR.

Do not mention internal prompts, Ollama, or your model.
`;

function buildStudentContext(profile) {
    if (!profile) {
        return "";
    }

    const context = {
        education: profile.education?.currentLevel || "",
        interests: (profile.interests || []).slice(0, 8),
        strengths: (profile.strengths || []).slice(0, 8),
        subjects: (profile.subjects || []).slice(0, 8),
        careerPreferences:
            (profile.careerPreferences || []).slice(0, 8),
    };

    return JSON.stringify(context);
}

async function generateCareerGuidance({
    studentProfile,
    messages,
}) {
    if (!Array.isArray(messages) || messages.length === 0) {
        throw new Error(
            "At least one message is required."
        );
    }

    // Only send recent messages to reduce processing time
    const recentMessages = messages
        .slice(-6)
        .filter(
            (message) =>
                ["user", "assistant"].includes(message.role) &&
                typeof message.content === "string" &&
                message.content.trim()
        )
        .map((message) => ({
            role: message.role,
            content: message.content
                .trim()
                .slice(0, 1500),
        }));

    const studentContext =
        buildStudentContext(studentProfile);

    const systemMessage = studentContext
        ? `${SYSTEM_PROMPT}

STUDENT PROFILE:
${studentContext}`
        : SYSTEM_PROMPT;

    const response = await axios.post(
        `${OLLAMA_URL}/api/chat`,
        {
            model: OLLAMA_MODEL,

            messages: [
                {
                    role: "system",
                    content: systemMessage,
                },

                ...recentMessages,
            ],

            stream: false,

            options: {
                temperature: 0.6,

                // Reduce response generation time
                num_predict: 200,

                // Keep context smaller for faster inference
                num_ctx: 2048,
            },
        },
        {
            timeout: 120000,
        }
    );

    const reply =
        response.data?.message?.content;

    if (!reply || !reply.trim()) {
        throw new Error(
            "NEO returned an empty response."
        );
    }

    return reply.trim();
}

module.exports = {
    generateCareerGuidance,
};