import Link from 'next/link'

type ActionLinkProps = {
  introText?: string
  linkText?: string
  href: string
  className?: string
}

const ActionLink = ({
  introText,
  linkText,
  href = '/register',
  className
}: ActionLinkProps) => (
  <p
    className={`text-xs text-foreground dark:text-foreground-dark font-semibold mt-6 ${className}`}
  >
    {introText}{' '}
    <Link className="text-link dark:text-link-dark font-medium" href={href}>
      {linkText}
    </Link>
  </p>
)

export default ActionLink
