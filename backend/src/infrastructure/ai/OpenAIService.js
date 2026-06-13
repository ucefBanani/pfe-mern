const { OpenAI } = require('openai');
const IAIService = require('../../application/services/IAIService');

class OpenAIService extends IAIService {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  // Suggest Task Priority
  async suggestPriority(taskTitle, taskDescription = '') {
    if (this.client) {
      try {
        const response = await this.client.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an AI project manager. Suggest a priority (Low, Medium, High) for the following task and provide a short, one-sentence explanation.'
            },
            {
              role: 'user',
              content: `Task Title: ${taskTitle}\nTask Description: ${taskDescription}`
            }
          ],
          response_format: { type: 'json_object' }
        });
        const content = JSON.parse(response.choices[0].message.content);
        return {
          priority: content.priority || 'Medium',
          reason: content.reason || 'Suggested based on title context.'
        };
      } catch (err) {
        console.error('OpenAI Error, falling back to mock:', err.message);
      }
    }

    // Mock Fallback
    const titleAndDesc = `${taskTitle} ${taskDescription}`.toLowerCase();
    let priority = 'Medium';
    let reason = 'Based on analysis of task keywords, this is of standard priority.';

    if (titleAndDesc.match(/(urgent|critical|crash|block|broken|fail|fix api|db down|prod|security)/i)) {
      priority = 'High';
      reason = 'Detected high-urgency keywords (e.g., crash, prod, critical) affecting development velocity.';
    } else if (titleAndDesc.match(/(refactor|documentation|cleanup|docs|comment|readme|minor|lint|style)/i)) {
      priority = 'Low';
      reason = 'Detected auxiliary tasks (e.g., refactoring, docs) that do not block core workflow features.';
    }

    return { priority, reason };
  }

  // Suggest Task Description
  async suggestDescription(taskTitle) {
    if (this.client) {
      try {
        const response = await this.client.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant. Generate a short, realistic 3-bullet description for a software development task with the given title. Keep it technical.'
            },
            { role: 'user', content: `Task Title: ${taskTitle}` }
          ]
        });
        return response.choices[0].message.content.trim();
      } catch (err) {
        console.error('OpenAI Error, falling back to mock:', err.message);
      }
    }

    // Mock Fallback
    const title = taskTitle.toLowerCase();
    if (title.includes('auth') || title.includes('login') || title.includes('register')) {
      return "- Design and build the authorization middleware and endpoints.\n- Add form inputs validations and password regex checks.\n- Return JSON Web Token (JWT) on successful verification.";
    }
    if (title.includes('database') || title.includes('mongo') || title.includes('mongoose')) {
      return "- Setup database connection configurations in environment variables.\n- Create required schemas and collection definitions.\n- Implement connection retry logic and index configurations.";
    }
    if (title.includes('ui') || title.includes('component') || title.includes('page')) {
      return "- Design responsive mock interface layout.\n- Bind API service events and handle loading / error status views.\n- Ensure style coherence with current design themes.";
    }
    return `- Define specific requirements and execution scopes for "${taskTitle}".\n- Connect API boundaries and write integration unit tests.\n- Refactor and code review matching Clean Architecture constraints.`;
  }

  // Estimate Task Complexity (Fibonacci Story Points)
  async estimateComplexity(taskTitle, taskDescription = '') {
    if (this.client) {
      try {
        const response = await this.client.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Evaluate the complexity of this task and return a Fibonacci point (1, 2, 3, 5, 8) in JSON format: {"points": 3, "explanation": "..."}.'
            },
            {
              role: 'user',
              content: `Task Title: ${taskTitle}\nTask Description: ${taskDescription}`
            }
          ],
          response_format: { type: 'json_object' }
        });
        return JSON.parse(response.choices[0].message.content);
      } catch (err) {
        console.error('OpenAI Error, falling back to mock:', err.message);
      }
    }

    // Mock Fallback
    const titleAndDesc = `${taskTitle} ${taskDescription}`.toLowerCase();
    let points = 3;
    let explanation = 'Medium complexity: standard implementation effort required.';

    if (titleAndDesc.match(/(setup|docker|config|readme|mock)/i)) {
      points = 1;
      explanation = 'Low complexity: simple configuration or text edit.';
    } else if (titleAndDesc.match(/(socket|realtime|openai|sync|auth|verify|forgot)/i)) {
      points = 5;
      explanation = 'High complexity: involves multiple integrations or security layers.';
    } else if (titleAndDesc.length > 250) {
      points = 8;
      explanation = 'Very high complexity: dense requirements demanding extensive refactoring.';
    }

    return { points, explanation };
  }

  // Generate Project Summary
  async generateProjectSummary(project, tasks) {
    const totalCount = tasks.length;
    const completedCount = tasks.filter(t => t.status === 'Done').length;
    const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
    const backlogCount = tasks.filter(t => t.status === 'Backlog' || t.status === 'Todo').length;
    const reviewCount = tasks.filter(t => t.status === 'Review').length;

    const taskListText = tasks.map(t => `- [${t.status}] ${t.title} (${t.priority} priority)`).join('\n');

    if (this.client) {
      try {
        const response = await this.client.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an executive project officer. Write a brief summary paragraph of the current status, velocity, and focus area of this project.'
            },
            {
              role: 'user',
              content: `Project Name: ${project.name}\nDescription: ${project.description}\nTasks:\n${taskListText}`
            }
          ]
        });
        return {
          totalTasks: totalCount,
          completedTasks: completedCount,
          activeTasks: inProgressCount + reviewCount,
          summary: response.choices[0].message.content.trim()
        };
      } catch (err) {
        console.error('OpenAI Error, falling back to mock:', err.message);
      }
    }

    // Mock Fallback
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const summary = `The project "${project.name}" contains ${totalCount} task(s) in total, with a completion rate of ${percentage}%. Currently, ${completedCount} task(s) are completed, ${inProgressCount} in progress, and ${reviewCount} under review. Development is focused on completing outstanding backlog items and implementing collaborative features.`;

    return {
      totalTasks: totalCount,
      completedTasks: completedCount,
      activeTasks: inProgressCount + reviewCount,
      summary
    };
  }

  // Generate Weekly Productivity Report
  async generateWeeklyProductivityReport(tasks) {
    const totalCount = tasks.length;
    const doneCount = tasks.filter(t => t.status === 'Done').length;
    const progressCount = tasks.filter(t => t.status === 'In Progress').length;
    const highPriorityCount = tasks.filter(t => t.priority === 'High').length;

    if (this.client) {
      try {
        const response = await this.client.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Write a brief productivity report summarizing completion rates, highlight bottleneck tasks, and make 3 recommendations in bullet points.'
            },
            {
              role: 'user',
              content: `All Team Tasks: ${tasks.map(t => `- ${t.title} (${t.status}, ${t.priority} priority)`).join('\n')}`
            }
          ]
        });
        return {
          completionRate: totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0,
          reportText: response.choices[0].message.content.trim()
        };
      } catch (err) {
        console.error('OpenAI Error, falling back to mock:', err.message);
      }
    }

    // Mock Fallback
    const rate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
    const reportText = `**Weekly TaskFlow AI Productivity Analysis**\n\n- **Completion Velocity:** The team completed ${doneCount} of ${totalCount} total tasks. Current productivity index is at ${rate}%.\n- **Bottlenecks:** There are ${highPriorityCount} high-priority tasks, with ${tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length} still incomplete, creating potential blocks.\n- **Recommendations:**\n  1. Prioritize completing Review status items to free up resources.\n  2. Reassign high-priority tasks that have stayed In Progress for over 48 hours.\n  3. Conduct daily standups to align on drag-and-drop state switches on the Kanban board.`;

    return {
      completionRate: rate,
      reportText
    };
  }
}

module.exports = OpenAIService;
