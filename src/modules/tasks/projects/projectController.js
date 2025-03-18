import ProjectService from "./projectService.js";

class ProjectController {
  async createProject(req, res) {
    try {
      const project = await ProjectService.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProjectById(req, res) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      res.status(200).json(project);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getAllProjects(req, res) {
    try {
      const projects = await ProjectService.getAllProjects();
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProject(req, res) {
    try {
      const project = await ProjectService.updateProject(req.params.id, req.body);
      res.status(200).json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProject(req, res) {
    try {
      await ProjectService.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new ProjectController();