import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface SectionHeadingProps {
  id?: string
  title: string
  icon?: ReactNode
  to?: string
  linkLabel?: string
}

export function SectionHeading({ id, title, icon, to, linkLabel = 'عرض الكل' }: SectionHeadingProps) {
  return (
    <div className="section-head">
      <h2 id={id}>
        {icon}
        {title}
      </h2>
      {to ? (
        <Link className="more" to={to}>
          {linkLabel}
          <ArrowLeft size={16} aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  )
}
