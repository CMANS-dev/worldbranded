interface PromoBannerProps {
  variant?: 'full' | 'half'
}

export default function PromoBanner({ variant = 'full' }: PromoBannerProps) {
  if (variant === 'half') {
    return (
      <div className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-[10px]">
        <div className="bg-[#D8D8D8] h-[60vw] md:h-[calc(100vh-3.5rem)]" />
        <div className="bg-[#D8D8D8] h-[60vw] md:h-[calc(100vh-3.5rem)]" />
      </div>
    )
  }

  return (
    <div className="px-4 md:px-6">
      <div className="bg-[#D8D8D8] w-full h-[75vw] md:h-[calc(100vh-3.5rem)]" />
    </div>
  )
}
