class AddWorkspaceMember {
  constructor({ workspaceRepository, userRepository }) {
    this.workspaceRepository = workspaceRepository;
    this.userRepository = userRepository;
  }

  async execute({ workspaceId, email, role = 'Member', requesterId }) {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new Error('Workspace not found.');
    }

    // Check if requester has authority (is Owner or Admin member)
    const requesterMember = await this.workspaceRepository.findMember(workspaceId, requesterId);
    const isOwner = workspace.owner.toString() === requesterId.toString();
    const isAdmin = requesterMember && requesterMember.role === 'Admin';

    if (!isOwner && !isAdmin) {
      throw new Error('Unauthorized. Only workspace owners or admins can add members.');
    }

    const invitee = await this.userRepository.findByEmail(email);
    if (!invitee) {
      throw new Error('User with this email does not exist.');
    }

    // Check if already a member
    const existingMember = await this.workspaceRepository.findMember(workspaceId, invitee.id);
    if (existingMember) {
      throw new Error('User is already a member of this workspace.');
    }

    await this.workspaceRepository.addMember(workspaceId, invitee.id, role);

    return {
      success: true,
      message: `User ${invitee.name} added to workspace as ${role}.`
    };
  }
}

module.exports = AddWorkspaceMember;
