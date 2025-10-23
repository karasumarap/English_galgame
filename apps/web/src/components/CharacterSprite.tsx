/**
 * CharacterSprite - キャラクター立ち絵表示コンポーネント
 * 表情・服装の切り替え、位置指定、フェードイン/アウトに対応
 */

import { useEffect, useState } from 'react'
import type { Character, SpriteSet } from '@engine/types'

interface CharacterSpriteProps {
  character: Character
  emotion?: string
  outfit?: string
  position?: 'left' | 'center' | 'right'
  visible?: boolean
  speaking?: boolean  // 話している時の強調表示
}

/**
 * キャラクターのスプライト画像パスを解決
 */
function resolveSpriteUrl(
  character: Character,
  emotion?: string,
  outfit?: string
): string {
  // 新しいsprites形式を優先
  if (character.sprites) {
    return resolveSpriteFromSet(character.sprites, emotion, outfit)
  }
  
  // 後方互換性: 古いsprite形式
  if (character.sprite) {
    return character.sprite
  }
  
  // フォールバック
  return ''
}

/**
 * SpriteSetから適切な画像パスを取得
 */
function resolveSpriteFromSet(
  sprites: SpriteSet,
  emotion?: string,
  outfit?: string
): string {
  // 服装が指定されている場合
  if (outfit && sprites.outfits?.[outfit]) {
    const outfitSprites = sprites.outfits[outfit]
    
    // 服装 + 表情
    if (emotion && outfitSprites.emotions?.[emotion]) {
      return outfitSprites.emotions[emotion]
    }
    
    // 服装 + デフォルト表情
    return outfitSprites.default
  }
  
  // 服装指定なし、表情のみ
  if (emotion && sprites.emotions?.[emotion]) {
    return sprites.emotions[emotion]
  }
  
  // デフォルト
  return sprites.default
}

/**
 * 位置に応じたスタイルを取得
 */
function getPositionStyle(position?: 'left' | 'center' | 'right'): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    height: '90%',
    maxHeight: '700px',
    width: 'auto',
    objectFit: 'contain',
    transition: 'all 0.5s ease-in-out',
    filter: 'drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.3))',
  }
  
  switch (position) {
    case 'left':
      return { ...baseStyle, left: '10%', transform: 'translateX(0)' }
    case 'right':
      return { ...baseStyle, right: '10%', transform: 'translateX(0)' }
    case 'center':
    default:
      return { ...baseStyle, left: '50%', transform: 'translateX(-50%)' }
  }
}

const CharacterSprite = ({
  character,
  emotion = 'normal',
  outfit,
  position = 'center',
  visible = true,
  speaking = false,
}: CharacterSpriteProps) => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState(false)

  // スプライトURLを解決
  useEffect(() => {
    const url = resolveSpriteUrl(character, emotion, outfit)
    console.log('🎨 CharacterSprite URL更新:', { 
      characterId: character.id, 
      emotion, 
      outfit, 
      url,
      visible,
      previousUrl: imageUrl
    })
    
    // URLが変わった場合のみisLoadedをリセット
    if (url !== imageUrl) {
      setImageUrl(url)
      setIsLoaded(false)
    }
  }, [character, emotion, outfit, visible, imageUrl])

  // 画像がない場合は何も表示しない
  if (!imageUrl) {
    return null
  }

  const positionStyle = getPositionStyle(position)
  
  const containerStyle: React.CSSProperties = {
    ...positionStyle,
    opacity: visible ? (isLoaded ? 1 : 0) : 0,
    pointerEvents: 'none',
    zIndex: speaking ? 20 : 10,
  }

  const imageStyle: React.CSSProperties = {
    height: '100%',
    width: 'auto',
    transform: speaking ? 'scale(1.02)' : 'scale(1)',
    filter: speaking 
      ? 'brightness(1.1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))'
      : 'brightness(1)',
    transition: 'all 0.3s ease',
  }

  console.log('🎨 CharacterSprite レンダリング:', { 
    characterId: character.id, 
    visible, 
    isLoaded,
    opacity: containerStyle.opacity,
    position 
  })

  return (
    <div style={containerStyle}>
      <img
        src={imageUrl}
        alt={`${character.name.en} - ${emotion || 'normal'}`}
        style={imageStyle}
        onLoad={() => {
          console.log('✅ CharacterSprite画像ロード完了:', character.id, imageUrl)
          setIsLoaded(true)
        }}
        onError={(e) => {
          console.error(`❌ Failed to load character sprite: ${imageUrl}`)
          // フォールバック処理
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
        }}
      />
    </div>
  )
}

export default CharacterSprite
