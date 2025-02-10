import { UserListItem } from '@/components/users/list/UserListItem'

import Pagination from '@/components/ui/Pagination'

import { Role, User } from '@/types/models/user'

const UserList = ({
  users,
  openDropdownIndex,
  onToggleDropdown,
  onRoleChange,
  totalPages,
  currentPage,
  onPageChange
}: {
  users: User[]
  openDropdownIndex: number | null
  onToggleDropdown: (index: number) => void
  onRoleChange: (params: { userId: number; roleId: Role }) => void
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}) => (
  <ul className="mb-2">
    {users.map((user, index) => (
      <UserListItem
        key={user.id}
        user={user}
        index={index}
        isDropdownOpen={openDropdownIndex === index}
        onToggleDropdown={onToggleDropdown}
        onRoleChange={onRoleChange}
      />
    ))}

    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  </ul>
)

export default UserList
