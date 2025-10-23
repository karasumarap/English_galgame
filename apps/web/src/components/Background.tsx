/**
 * Background - 背景画像コンポーネント
 */

interface BackgroundProps {
  image?: string
}

const Background = ({ image }: BackgroundProps) => {
  console.log('🖼️ Background image:', image)
  
  if (!image) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-vn-bg to-vn-dialog" style={{ zIndex: 0 }} />
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-gray-900" style={{ zIndex: 0 }}>
      <img
        src={image}
        alt="Background"
        className="w-full h-full object-cover"
        style={{
          filter: 'brightness(0.85)',
        }}
        onLoad={() => console.log('✅ Background loaded:', image)}
        onError={(e) => {
          console.error('❌ Failed to load background:', image)
          // フォールバック: グラデーション背景を表示
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
        }}
      />
    </div>
  )
}

export default Background
