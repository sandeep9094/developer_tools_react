import { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import './QrGenerator.css'

interface QrGeneratorProps {}

function QrGenerator({}: QrGeneratorProps) {
  const [format, setFormat] = useState('QR Code 2D')
  const [content, setContent] = useState('1 Lorem ipsum dolor sit amet.')
  const [width, setWidth] = useState(200)
  const [height, setHeight] = useState(200)
  const [margin, setMargin] = useState(0)
  const [errorCorrection, setErrorCorrection] = useState('M') // M = ~30%
  const [compactMode, setCompactMode] = useState(false)
  const [useGS1, setUseGS1] = useState(false)
  const [version, setVersion] = useState('auto')
  const [maskPattern, setMaskPattern] = useState('auto')
  const [isInputExpanded, setIsInputExpanded] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const qrRef = useRef<HTMLDivElement>(null)

  // Error correction level mapping
  const errorCorrectionLevels = {
    'L': { value: 'L', label: '~7%' },
    'M': { value: 'M', label: '~30%' },
    'Q': { value: 'Q', label: '~55%' },
    'H': { value: 'H', label: '~65%' }
  }

  // Generate QR code data URL for export
  useEffect(() => {
    if (qrRef.current) {
      const svg = qrRef.current.querySelector('svg')
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        canvas.width = width
        canvas.height = height
        
        img.onload = () => {
          if (ctx) {
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, width, height)
            ctx.drawImage(img, 0, 0, width, height)
            setQrDataUrl(canvas.toDataURL('image/png'))
          }
        }
        
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)
        img.src = url
      }
    }
  }, [content, width, height, errorCorrection, margin])

  const showToastNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    showToastNotification('Copied!')
  }

  const handleClear = () => {
    setContent('')
  }

  const handleExport = () => {
    if (qrDataUrl) {
      const link = document.createElement('a')
      link.download = 'qrcode.png'
      link.href = qrDataUrl
      link.click()
    }
  }


  return (
    <div className="qr-generator-container">
      {showToast && (
        <div className="qr-toast">
          {toastMessage}
        </div>
      )}
      <div className="qr-generator-card">
        <div className="qr-generator-header">
          <h1 className="qr-generator-title">QR Code/Barcode Generator</h1>
          <button className="qr-settings-btn" title="Settings">
            ⚙️
          </button>
        </div>

        <div className="qr-generator-content">
          {/* Left Column - Controls */}
          <div className="qr-controls-column">
            {/* Format Selection */}
            <div className="qr-control-group">
              <label className="qr-label">Format:</label>
              <select
                className="qr-select"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="QR Code 2D">QR Code 2D</option>
                <option value="Code 128">Code 128</option>
                <option value="Code 39">Code 39</option>
                <option value="EAN-13">EAN-13</option>
              </select>
            </div>

            {/* Content Input */}
            <div className="qr-control-group">
              <div className="qr-input-header">
                <label className="qr-label">Content input:</label>
                <div className="qr-input-actions">
                  <button className="qr-btn-outline" onClick={handleCopy}>
                    Copy
                  </button>
                  <button className="qr-btn-outline" onClick={handleClear}>
                    Clear
                  </button>
                  <button
                    className="qr-icon-btn"
                    onClick={() => setIsInputExpanded(!isInputExpanded)}
                    title={isInputExpanded ? "Collapse" : "Expand"}
                  >
                    {isInputExpanded ? '←' : '→'}
                  </button>
                </div>
              </div>
              <textarea
                className={`qr-textarea ${isInputExpanded ? 'expanded' : ''}`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter content for QR code..."
              />
            </div>

            {/* Dimensions */}
            <div className="qr-control-group qr-dimensions">
              <div className="qr-dimension-item">
                <label className="qr-label">Width:</label>
                <input
                  type="number"
                  className="qr-input-number"
                  value={width}
                  onChange={(e) => setWidth(Math.max(50, Math.min(1000, parseInt(e.target.value) || 200)))}
                  min="50"
                  max="1000"
                />
              </div>
              <div className="qr-dimension-item">
                <label className="qr-label">Height:</label>
                <input
                  type="number"
                  className="qr-input-number"
                  value={height}
                  onChange={(e) => setHeight(Math.max(50, Math.min(1000, parseInt(e.target.value) || 200)))}
                  min="50"
                  max="1000"
                />
              </div>
              <div className="qr-dimension-item">
                <label className="qr-label">Margin:</label>
                <input
                  type="number"
                  className="qr-input-number"
                  value={margin}
                  onChange={(e) => setMargin(Math.max(0, Math.min(50, parseInt(e.target.value) || 0)))}
                  min="0"
                  max="50"
                />
              </div>
            </div>

            {/* Error Correction */}
            <div className="qr-control-group">
              <label className="qr-label">Error correction:</label>
              <select
                className="qr-select"
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value)}
              >
                {Object.values(errorCorrectionLevels).map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Advanced Options */}
            <div className="qr-control-group">
              <div className="qr-checkbox-group">
                <label className="qr-checkbox-label">
                  <input
                    type="checkbox"
                    checked={compactMode}
                    onChange={(e) => setCompactMode(e.target.checked)}
                    className="qr-checkbox"
                  />
                  <span>Compact mode</span>
                </label>
                <label className={`qr-checkbox-label ${!compactMode ? 'disabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={useGS1}
                    onChange={(e) => setUseGS1(e.target.checked)}
                    disabled={!compactMode}
                    className="qr-checkbox"
                  />
                  <span>Use GS1</span>
                </label>
              </div>
              <div className="qr-advanced-row">
                <div className="qr-advanced-item">
                  <label className="qr-label">Version:</label>
                  <select
                    className="qr-select"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                  >
                    <option value="auto">Minimum</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div className="qr-advanced-item">
                  <label className="qr-label">Mask pattern:</label>
                  <select
                    className="qr-select"
                    value={maskPattern}
                    onChange={(e) => setMaskPattern(e.target.value)}
                  >
                    <option value="auto">Best</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Export */}
            <div className="qr-control-group">
              <div className="qr-export-group">
                <label className="qr-label">Export:</label>
                <button className="qr-icon-btn" onClick={handleExport} title="Export">
                  🖨️
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Generated Image */}
          <div className="qr-output-column">
            <label className="qr-label">Generated image:</label>
            <div className="qr-image-container" ref={qrRef}>
              {content && (
                <QRCodeSVG
                  value={content}
                  size={width}
                  level={errorCorrection as 'L' | 'M' | 'Q' | 'H'}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  marginSize={margin}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QrGenerator

