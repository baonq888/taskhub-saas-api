import TaskService from "./taskService.js";

class TaskController {
  async createTask(req, res) {
    try {
      const task = await TaskService.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async assignTask(req, res) {
    try {
      const { taskId, userId } = req.body;
      const adminUserId = req.user.id;

      const task = await TaskService.assignTask(taskId, userId, adminUserId);
      res.status(200).json({ message: "Task assigned successfully", task });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTaskById(req, res) {
    try {
      const task = await TaskService.getTaskById(req.params.id);
      res.status(200).json(task);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getAllTasks(req, res) {
    try {
      const tasks = await TaskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateTask(req, res) {
    try {
      const task = await TaskService.updateTask(req.params.id, req.body);
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTask(req, res) {
    try {
      await TaskService.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new TaskController();