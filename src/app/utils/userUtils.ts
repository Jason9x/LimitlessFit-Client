import { User, Role } from '@/types/models/user'

export const updateUserRoleInArray = (
  users: User[],
  userId: number,
  newRole: Role
): User[] =>
  users.map(user => (user.id === userId ? { ...user, roleId: newRole } : user))

export const sortUsersByRoleAndName = (users: User[]): User[] =>
  [...users].sort((userA, userB) => {
    const rolePriority = (role: Role) => (role === Role.Admin ? 0 : 1)
    const roleCompare = rolePriority(userA.roleId) - rolePriority(userB.roleId)

    return roleCompare !== 0
      ? roleCompare
      : (userA.name ?? '').localeCompare(userB.name ?? '')
  })
