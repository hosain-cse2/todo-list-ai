import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import Groq from "groq-sdk";
import * as projectRepository from "../db/repositories/project.repository";
import * as todoRepository from "../db/repositories/todo.repository";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function list(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.sub;
  const projects = await projectRepository.findManyByUserId(userId);
  res.json({ projects });
}

export async function getById(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.sub;
  const project = await projectRepository.findById(id, userId);

  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  res.json({ project });
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.sub;
  const { name, description } = req.body as { name: string; description?: string };
  const project = await projectRepository.create(
    userId,
    name.trim(),
    (description ?? "").trim(),
  );
  res.status(201).json({ project });
}

export async function createTodo(req: AuthRequest, res: Response): Promise<void> {
  const { id: projectId } = req.params;
  const userId = req.user!.sub;
  const { text } = req.body as { text: string };

  const project = await projectRepository.findById(projectId, userId);
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  const todo = await todoRepository.create(project.id, text);
  res.status(201).json({ todo });
}

export async function deleteTodo(req: AuthRequest, res: Response): Promise<void> {
  const { id: projectId, todoId } = req.params;
  const userId = req.user!.sub;

  const project = await projectRepository.findById(projectId, userId);
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  const result = await todoRepository.deleteById(todoId, project.id);
  if (result.count === 0) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  res.status(204).send();
}

export async function updateTodo(req: AuthRequest, res: Response): Promise<void> {
  const { id: projectId, todoId } = req.params;
  const userId = req.user!.sub;
  const { text, completed } = req.body as { text?: string; completed?: boolean };

  const project = await projectRepository.findById(projectId, userId);
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  const todo = await todoRepository.update(todoId, project.id, {
    ...(text !== undefined && { text }),
    ...(completed !== undefined && { completed }),
  });

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  res.json({ todo });
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.sub;
  const { name, description } = req.body as { name?: string; description?: string };

  if (name === undefined && description === undefined) {
    res.status(400).json({ message: "Provide name and/or description to update" });
    return;
  }

  const project = await projectRepository.update(id, userId, {
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
  });

  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  res.json({ project });
}

export async function remove(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.sub;

  const result = await projectRepository.deleteById(id, userId);
  if (result.count === 0) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  res.status(204).send();
}

export async function generateTodos(req: AuthRequest, res: Response): Promise<void> {
  const { id: projectId } = req.params;
  const userId = req.user!.sub;

  const project = await projectRepository.findById(projectId, userId);
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  try {
    // Call Groq API to generate todos
    const prompt = `Based on this project:
Name: ${project.name}
Description: ${project.description || "No description provided"}

Generate 5-8 practical todo items for this project. Return ONLY a JSON array of strings, each string being a todo item. Do not include any other text or explanation. Example format: ["Todo item 1", "Todo item 2", "Todo item 3"]`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant", // Fast and free tier friendly
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      res.status(500).json({ message: "Failed to generate todos" });
      return;
    }

    // Parse JSON array from response (handle cases where response might have markdown code blocks)
    let todosArray: string[] = [];
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        todosArray = JSON.parse(jsonMatch[0]);
      } else {
        todosArray = JSON.parse(content);
      }
    } catch (parseError) {
      // If JSON parsing fails, try to extract lines as individual todos
      const lines = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith("```"))
        .slice(0, 8); // Limit to 8 items
      todosArray = lines;
    }

    if (!Array.isArray(todosArray) || todosArray.length === 0) {
      res.status(500).json({ message: "Invalid response format from AI" });
      return;
    }

    // Create todos in database
    const createdTodos = [];
    for (const todoText of todosArray.slice(0, 8)) {
      // Limit to 8 todos max
      if (todoText && typeof todoText === "string" && todoText.trim().length > 0) {
        const todo = await todoRepository.create(project.id, todoText.trim());
        createdTodos.push(todo);
      }
    }

    // Return updated project with all todos
    const updatedProject = await projectRepository.findById(project.id, userId);
    res.json({ project: updatedProject, generatedCount: createdTodos.length });
  } catch (error) {
    console.error("Error generating todos:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to generate todos",
    });
  }
}

