import ProjectService from "./projectService.js";

class ProjectController {
  static async createProject(req, res) {
    try {
      const { tenantId } = req.params;
      const data = req.body;
      const project = await ProjectService.createProject(tenantId, data);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProjectById(req, res) {
    try {
      const { tenantId, projectId } = req.params;
      const project = await ProjectService.getProjectById(tenantId, projectId);
      res.status(200).json(project);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getAllProjects(req, res) {
    try {
      const { tenantId } = req.params;
      const projects = await ProjectService.getAllProjects(tenantId);
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProject(req, res) {
    try {
      const { tenantId, projectId } = req.params;
      const data = req.body
      const project = await ProjectService.updateProject(tenantId, projectId, data);
      res.status(200).json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteProject(req, res) {
    try {
      const { tenantId, projectId } = req.params;
      await ProjectService.deleteProject(tenantId, projectId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async inviteUserToProject(req, res) {
    try {
      const { tenantId, projectId } = req.params;
      const { emails } = req.body;
      const result = await ProjectService.inviteUsersToProject(tenantId, projectId, emails);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUsersInProjects(req, res) {
    try {
      const { tenantId } = req.params;
      const projects = await ProjectService.getAllProjects(tenantId);
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ProjectController;