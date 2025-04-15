import TaskService from "./taskService.js";
import { RabbitMQEventBus } from '../../../infrastructure/messaging/RabbitMQEventBus.js';
import {TRIGGERS} from "../../../core/config/automation/automationConstants.js";

const eventBus = new RabbitMQEventBus();

class TaskController {
  static async createTask(req, res) {
    try {
      const { boardId } = req.params;
      const { data } = req.body
      const userId = req.user.id;
      const task = await TaskService.createTask(boardId, userId, data);

      await eventBus.publish({
        name: TRIGGERS.TASK_CREATED,
        user: req.user,
        task,
      });

      res.status(201).json({message: "Task Created", task});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async assignTask(req, res) {
    try {
      const { taskId } = req.params
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
      const { taskId } = req.params
      const { userIds } = req.body;
      const adminUserId = req.user.id;

      await TaskService.unassignTask(taskId, userIds, adminUserId);
      res.status(200).json({ message: "User unassigned from task successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getTaskById(req, res) {
    try {
      const { taskId } = req.params
      const task = await TaskService.getTaskById(taskId);
      res.status(200).json(task);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getAllTasks(req, res) {
    try {
      const { boardId} = req.params
      const tasks = await TaskService.getAllTasks(boardId);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateTask(req, res) {
    try {
      const { taskId } = req.params
      const {data} = req.body;
      const task = await TaskService.updateTask(taskId, data);
      res.status(200).json({message: "Task Updated", task});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateTaskStatus(req, res) {
    try {
      const { taskId } = req.params;
      const {status} = req.body;

      const task = await TaskService.updateTaskStatus(taskId, status);
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