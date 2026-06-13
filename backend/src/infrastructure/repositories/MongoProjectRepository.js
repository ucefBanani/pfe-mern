const ProjectRepository = require('../../domain/repositories/ProjectRepository');
const ProjectModel = require('../database/models/ProjectModel');
const Project = require('../../domain/entities/Project');

class MongoProjectRepository extends ProjectRepository {
  _mapToEntity(doc) {
    if (!doc) return null;
    return new Project({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      workspaceId: doc.workspaceId.toString(),
      createdAt: doc.createdAt
    });
  }

  async save(projectEntity) {
    const data = {
      name: projectEntity.name,
      description: projectEntity.description,
      workspaceId: projectEntity.workspaceId
    };

    let doc;
    if (projectEntity.id) {
      doc = await ProjectModel.findByIdAndUpdate(projectEntity.id, data, { new: true });
    } else {
      doc = new ProjectModel(data);
      await doc.save();
    }

    return this._mapToEntity(doc);
  }

  async findById(id) {
    const doc = await ProjectModel.findById(id);
    return this._mapToEntity(doc);
  }

  async findByWorkspaceId(workspaceId) {
    const docs = await ProjectModel.find({ workspaceId }).sort({ createdAt: -1 });
    return docs.map(doc => this._mapToEntity(doc));
  }

  async countAll() {
    return await ProjectModel.countDocuments();
  }
}

module.exports = MongoProjectRepository;
