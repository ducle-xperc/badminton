import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn, getDefaultAvatar } from "@/lib/utils"

const avatarVariants = cva("rounded-full overflow-hidden flex-shrink-0", {
  variants: {
    size: {
      sm: "size-8",
      md: "size-12",
      lg: "size-20",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null
  alt?: string
  gender?: string | null
}

function Avatar({
  className,
  size,
  src,
  alt = "Avatar",
  gender,
  ...props
}: AvatarProps) {
  const avatarSrc = src || getDefaultAvatar(gender)

  return (
    <div
      data-slot="avatar"
      className={cn(avatarVariants({ size, className }))}
      {...props}
    >
      <img src={avatarSrc} alt={alt} className="w-full h-full object-cover" />
    </div>
  )
}

export { Avatar, avatarVariants }
