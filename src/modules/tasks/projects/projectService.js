import ProjectRepository from "./ProjectRepository.js";

class ProjectService {
  async createProject(data) {
    return ProjectRepository.createProject(data);
  }

  async getProjectById(id) {
    return ProjectRepository.getProjectById(id);
  }

  async getAllProjects() {
    return ProjectRepository.getAllProjects();
  }

  async updateProject(id, data) {
    return ProjectRepository.updateProject(id, data);
  }

  async deleteProject(id) {
    return ProjectRepository.deleteProject(id);
  }
}

export default new ProjectService();