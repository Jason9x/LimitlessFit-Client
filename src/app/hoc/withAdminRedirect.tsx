import { ComponentType, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import useUser from '@/hooks/useUser'

import { Role } from '@/types/models/user'

const withAdminRedirect = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const ComponentWithAdminRedirect = (props: P) => {
    const { user } = useUser()
    const router = useRouter()

    useEffect(() => {
      if (user && user.role !== Role.Admin) router.push('/')
    }, [user, router])

    return <WrappedComponent {...props} />
  }

  ComponentWithAdminRedirect.displayName = `withAdminRedirect(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return ComponentWithAdminRedirect
}

export default withAdminRedirect
