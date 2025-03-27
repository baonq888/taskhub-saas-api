import TaskService from "./taskService.js";

class TaskController {
  static async createTask(req, res) {
    try {
      const task = await TaskService.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async assignTask(req, res) {
    try {
      const { taskId } = req.params;
      const { userIds } = req.body; // an array of userIds
      const adminUserId = req.user.id;

      const taskAssignments = await TaskService.assignTask(taskId, userIds, adminUserId);
      res.status(200).json({ message: "Task assigned successfully", taskAssignments });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async unassignTask(req, res) {
    try {
      const { taskId } = req.params;
      const { userId } = req.body;

      await TaskService.unassignTask(taskId, userId);
      res.status(200).json({ message: "User unassigned from task successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getTaskById(req, res) {
    try {
      const task = await TaskService.getTaskById(req.params.id);
      res.status(200).json(task);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getAllTasks(req, res) {
    try {
      const tasks = await TaskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateTask(req, res) {
    try {
      const task = await TaskService.updateTask(req.params.id, req.body);
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteTask(req, res) {
    try {
      await TaskService.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default TaskController;