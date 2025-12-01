import { useState, useRef, useEffect, useCallback } from 'react'
import './ColorPicker.css'

interface RGB {
  r: number
  g: number
  b: number
}

interface HSL {
  h: number
  s: number
  l: number
}

function ColorPicker() {
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(0)
  const [lightness, setLightness] = useState(0)
  const [alpha, setAlpha] = useState(100)
  const [decimalPlaces, setDecimalPlaces] = useState(2)
  const [showSettings, setShowSettings] = useState(false)
  
  const gradientRef = useRef<HTMLDivElement>(null)
  const hueSliderRef = useRef<HTMLDivElement>(null)
  const alphaSliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState<'gradient' | 'hue' | 'alpha' | null>(null)

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): RGB => {
    h = h / 360
    s = s / 100
    l = l / 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): HSL => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number, includeAlpha = false): string => {
    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16).padStart(2, '0')
      return hex.toUpperCase()
    }
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`
    if (includeAlpha) {
      const alphaHex = Math.round((alpha / 100) * 255).toString(16).padStart(2, '0').toUpperCase()
      return `${hex}${alphaHex}`
    }
    return hex
  }

  // Convert Hex to RGB
  const hexToRgb = (hex: string): RGB | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex)
    if (result) {
      const r = parseInt(result[1], 16)
      const g = parseInt(result[2], 16)
      const b = parseInt(result[3], 16)
      if (result[4]) {
        const a = parseInt(result[4], 16)
        setAlpha(Math.round((a / 255) * 100))
      }
      return { r, g, b }
    }
    return null
  }

  const rgb = hslToRgb(hue, saturation, lightness)
  const alphaValue = alpha / 100

  // CSS Color Formats
  const formatNumber = (num: number) => {
    if (decimalPlaces === 0) return Math.round(num).toString()
    return num.toFixed(decimalPlaces)
  }

  const cssColors = {
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${formatNumber(alphaValue)})`,
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    hexAlpha: rgbToHex(rgb.r, rgb.g, rgb.b, true),
    hsl: `hsl(${hue}, ${formatNumber(saturation)}%, ${formatNumber(lightness)}%)`,
    hsla: `hsla(${hue}, ${formatNumber(saturation)}%, ${formatNumber(lightness)}%, ${formatNumber(alphaValue)})`,
  }

  const handleGradientClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gradientRef.current) return
    const rect = gradientRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    
    setSaturation(Math.round(x * 100))
    setLightness(Math.round((1 - y) * 100))
  }

  const handleHueSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hueSliderRef.current) return
    const rect = hueSliderRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setHue(Math.round(x * 360))
  }

  const handleAlphaSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!alphaSliderRef.current) return
    const rect = alphaSliderRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setAlpha(Math.round(x * 100))
  }

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [component]: Math.max(0, Math.min(255, value)) }
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b)
    setHue(hsl.h)
    setSaturation(hsl.s)
    setLightness(hsl.l)
  }

  const handleHexChange = (hex: string) => {
    if (hex.startsWith('#')) {
      const rgb = hexToRgb(hex)
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        setHue(hsl.h)
        setSaturation(hsl.s)
        setLightness(hsl.l)
      }
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleEyedropper = async () => {
    try {
      // @ts-ignore - EyeDropper API might not be in types
      const eyeDropper = new EyeDropper()
      const result = await eyeDropper.open()
      if (result.sRGBHex) {
        const rgb = hexToRgb(result.sRGBHex)
        if (rgb) {
          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
          setHue(hsl.h)
          setSaturation(hsl.s)
          setLightness(hsl.l)
        }
      }
    } catch (err) {
      console.error('Eyedropper not supported or cancelled:', err)
    }
  }

  const handleParseCss = () => {
    // This would parse a CSS color value - simplified for now
    const input = prompt('Enter CSS color value (e.g., rgb(255,0,0), #ff0000, hsl(0,100%,50%)):')
    if (input) {
      // Simple parsing - can be enhanced
      if (input.startsWith('#')) {
        handleHexChange(input)
      } else if (input.startsWith('rgb')) {
        const match = input.match(/\d+/g)
        if (match && match.length >= 3) {
          const r = parseInt(match[0])
          const g = parseInt(match[1])
          const b = parseInt(match[2])
          const hsl = rgbToHsl(r, g, b)
          setHue(hsl.h)
          setSaturation(hsl.s)
          setLightness(hsl.l)
          if (match.length >= 4) {
            setAlpha(parseFloat(match[3]) * 100)
          }
        }
      }
    }
  }

  // Mouse drag handlers
  const handleMouseDown = (type: 'gradient' | 'hue' | 'alpha') => {
    setIsDragging(type)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return

    if (isDragging === 'gradient' && gradientRef.current) {
      const rect = gradientRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
      setSaturation(Math.round(x * 100))
      setLightness(Math.round((1 - y) * 100))
    } else if (isDragging === 'hue' && hueSliderRef.current) {
      const rect = hueSliderRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      setHue(Math.round(x * 360))
    } else if (isDragging === 'alpha' && alphaSliderRef.current) {
      const rect = alphaSliderRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      setAlpha(Math.round(x * 100))
    }
  }, [isDragging])

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove])

  const gradientStyle = {
    background: `linear-gradient(to bottom, transparent, black), linear-gradient(to right, white, hsl(${hue}, 100%, 50%))`,
  }

  const hueSliderStyle = {
    background: `linear-gradient(to right, 
      hsl(0, 100%, 50%), 
      hsl(60, 100%, 50%), 
      hsl(120, 100%, 50%), 
      hsl(180, 100%, 50%), 
      hsl(240, 100%, 50%), 
      hsl(300, 100%, 50%), 
      hsl(360, 100%, 50%))`,
  }

  const alphaSliderStyle = {
    background: `linear-gradient(to right, 
      rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0), 
      rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1))`,
  }

  const currentColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alphaValue})`

  return (
    <div className="color-picker-container">
      <div className="color-picker-card">
        <h2 className="color-picker-title">Color Picker</h2>

        <div className="color-picker-main">
          <div className="color-picker-left">
            <div className="color-picker-gradient-section">
              <div
                ref={gradientRef}
                className="color-picker-gradient"
                style={gradientStyle}
                onClick={handleGradientClick}
                onMouseDown={() => handleMouseDown('gradient')}
              >
                <div
                  className="color-picker-selector"
                  style={{
                    left: `${saturation}%`,
                    top: `${100 - lightness}%`,
                  }}
                />
              </div>

              <div className="color-picker-controls">
                <div className="color-picker-control-row">
                  <button className="eyedropper-button" onClick={handleEyedropper} title="Pick color from screen">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      <path d="M2 22l3.5-3.5"/>
                    </svg>
                  </button>
                  <div
                    className="color-preview"
                    style={{ backgroundColor: currentColor }}
                  />
                  <div className="color-sliders">
                    <div
                      ref={hueSliderRef}
                      className="color-slider hue-slider"
                      style={hueSliderStyle}
                      onClick={handleHueSliderClick}
                      onMouseDown={() => handleMouseDown('hue')}
                    >
                      <div
                        className="slider-thumb"
                        style={{ left: `${(hue / 360) * 100}%` }}
                      />
                    </div>
                    <div
                      ref={alphaSliderRef}
                      className="color-slider alpha-slider"
                      style={alphaSliderStyle}
                      onClick={handleAlphaSliderClick}
                      onMouseDown={() => handleMouseDown('alpha')}
                    >
                      <div
                        className="slider-thumb"
                        style={{ left: `${alpha}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="color-picker-right">
            <div className="color-picker-inputs">
              <div className="color-input-group">
                <label className="color-input-label">R</label>
                <input
                  type="number"
                  className="color-input"
                  value={rgb.r}
                  onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                  min="0"
                  max="255"
                />
              </div>
              <div className="color-input-group">
                <label className="color-input-label">G</label>
                <input
                  type="number"
                  className="color-input"
                  value={rgb.g}
                  onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                  min="0"
                  max="255"
                />
              </div>
              <div className="color-input-group">
                <label className="color-input-label">B</label>
                <input
                  type="number"
                  className="color-input"
                  value={rgb.b}
                  onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                  min="0"
                  max="255"
                />
              </div>
              <div className="color-input-group">
                <label className="color-input-label">A%</label>
                <input
                  type="number"
                  className="color-input"
                  value={alpha}
                  onChange={(e) => setAlpha(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                  min="0"
                  max="100"
                />
              </div>
              <div className="color-input-group">
                <label className="color-input-label">Hex</label>
                <input
                  type="text"
                  className="color-input color-input-hex"
                  value={rgbToHex(rgb.r, rgb.g, rgb.b, true)}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="#000000FF"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="css-colors-section">
          <h3 className="css-colors-title">CSS Colors</h3>
          <div className="css-colors-list">
            {Object.entries(cssColors).map(([key, value]) => (
              <div key={key} className="css-color-item">
                <code className="css-color-code">{value}</code>
                <button
                  className="css-color-copy"
                  onClick={() => handleCopy(value)}
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
            ))}
          </div>
          <button className="parse-css-button" onClick={handleParseCss}>
            Parse CSS Color Value
          </button>
        </div>

        <div className="settings-section">
          <button
            className="settings-toggle"
            onClick={() => setShowSettings(!showSettings)}
          >
            <span>Settings</span>
            <span className="settings-arrow">{showSettings ? '▼' : '▶'}</span>
          </button>
          {showSettings && (
            <div className="settings-content">
              <label className="settings-label">
                Decimal places:
                <input
                  type="number"
                  className="settings-input"
                  value={decimalPlaces}
                  onChange={(e) => setDecimalPlaces(Math.max(0, Math.min(10, parseInt(e.target.value) || 2)))}
                  min="0"
                  max="10"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ColorPicker

