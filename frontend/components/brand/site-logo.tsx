import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

type SiteLogoProps = {
  className?: string
  /** Tailwind height classes for the image (e.g. h-8, h-9) */
  imgClassName?: string
  priority?: boolean
}

export function SiteLogo({
  className,
  imgClassName = "h-9 w-auto max-w-[200px]",
  priority = false,
}: SiteLogoProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center shrink-0", className)}>
      <Image
        src="/World-Hire-Logo.png"
        alt="World Hire"
        width={240}
        height={72}
        className={cn("object-contain object-left", imgClassName)}
        priority={priority}
      />
    </Link>
  )
}
