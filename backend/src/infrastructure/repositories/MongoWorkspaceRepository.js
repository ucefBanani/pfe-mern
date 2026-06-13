const WorkspaceRepository = require('../../domain/repositories/WorkspaceRepository');
const { Workspace: WorkspaceModel, WorkspaceMember: WorkspaceMemberModel } = require('../database/models/WorkspaceModel');
const Workspace = require('../../domain/entities/Workspace');

class MongoWorkspaceRepository extends WorkspaceRepository {
  _mapToEntity(doc) {
    if (!doc) return null;
    return new Workspace({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      owner: doc.owner.toString(),
      createdAt: doc.createdAt
    });
  }

  async save(workspaceEntity) {
    const data = {
      name: workspaceEntity.name,
      description: workspaceEntity.description,
      owner: workspaceEntity.owner
    };

    let doc;
    if (workspaceEntity.id) {
      doc = await WorkspaceModel.findByIdAndUpdate(workspaceEntity.id, data, { new: true });
    } else {
      doc = new WorkspaceModel(data);
      await doc.save();
    }

    return this._mapToEntity(doc);
  }

  async findById(id) {
    const doc = await WorkspaceModel.findById(id);
    return this._mapToEntity(doc);
  }

  async findByOwner(ownerId) {
    const docs = await WorkspaceModel.find({ owner: ownerId }).sort({ createdAt: -1 });
    return docs.map(doc => this._mapToEntity(doc));
  }

  async findByUserMembership(userId) {
    // Find all memberships
    const memberships = await WorkspaceMemberModel.find({ userId }).populate('workspaceId');
    // Filter and map to entity (only return workspaces that actually exist)
    return memberships
      .filter(m => m.workspaceId !== null)
      .map(m => this._mapToEntity(m.workspaceId));
  }

  async addMember(workspaceId, userId, role = 'Member') {
    const membership = new WorkspaceMemberModel({
      workspaceId,
      userId,
      role
    });
    await membership.save();
    return membership;
  }

  async getMembers(workspaceId) {
    const memberships = await WorkspaceMemberModel.find({ workspaceId }).populate('userId', 'name email role');
    return memberships.map(m => ({
      userId: m.userId._id.toString(),
      name: m.userId.name,
      email: m.userId.email,
      role: m.role,
      joinedAt: m.joinedAt
    }));
  }

  async findMember(workspaceId, userId) {
    const doc = await WorkspaceMemberModel.findOne({ workspaceId, userId });
    if (!doc) return null;
    return {
      workspaceId: doc.workspaceId.toString(),
      userId: doc.userId.toString(),
      role: doc.role,
      joinedAt: doc.joinedAt
    };
  }
}

module.exports = MongoWorkspaceRepository;
