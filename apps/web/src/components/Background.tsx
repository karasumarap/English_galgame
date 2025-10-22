/**
 * Background - 背景画像コンポーネント
 */

interface BackgroundProps {
  image?: string
}

const Background = ({ image }: BackgroundProps) => {
  if (!image) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-vn-bg to-vn-dialog -z-10" />
    )
  }

  return (
    <div
      className="absolute inset-0 bg-cover bg-center -z-10"
      style={{
        backgroundImage: `url(${image})`,
        filter: 'brightness(0.7)',
      }}
    />
  )
}

export default Background
