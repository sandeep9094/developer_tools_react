import { useState, useEffect } from 'react'
import './CliCommandBreaks.css'

interface CliCommandBreaksProps {}

function CliCommandBreaks({}: CliCommandBreaksProps) {
  const [withoutBreaks, setWithoutBreaks] = useState('python script.py --input-file=input.txt --output-file=output.txt --verbose')
  const [withBreaks, setWithBreaks] = useState('')
  const [delimiter, setDelimiter] = useState('^')
  const [inputTab, setInputTab] = useState<'text' | 'file'>('text')
  const [outputTab, setOutputTab] = useState<'text' | 'file'>('text')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const showToastNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 2000)
  }

  // Convert command to multi-line format
  const convertToMultiLine = (command: string, delim: string): string => {
    if (!command.trim()) {
      return ''
    }

    // Split by spaces, but preserve quoted strings
    const parts: string[] = []
    let currentPart = ''
    let inQuotes = false
    let quoteChar = ''

    for (let i = 0; i < command.length; i++) {
      const char = command[i]
      
      if ((char === '"' || char === "'") && (i === 0 || command[i - 1] !== '\\')) {
        if (!inQuotes) {
          inQuotes = true
          quoteChar = char
          currentPart += char
        } else if (char === quoteChar) {
          inQuotes = false
          quoteChar = ''
          currentPart += char
        } else {
          currentPart += char
        }
      } else if (char === ' ' && !inQuotes) {
        if (currentPart.trim()) {
          parts.push(currentPart.trim())
          currentPart = ''
        }
      } else {
        currentPart += char
      }
    }
    
    if (currentPart.trim()) {
      parts.push(currentPart.trim())
    }

    // Join parts with delimiter and line breaks
    if (parts.length === 0) {
      return command
    }

    const result = parts.map((part, index) => {
      if (index === parts.length - 1) {
        return part
      }
      return `${part} ${delimiter}`
    }).join('\n')

    return result
  }

  // Convert multi-line back to single line
  const convertToSingleLine = (multiLine: string, delim: string): string => {
    if (!multiLine.trim()) {
      return ''
    }

    // Remove delimiter and join lines
    const lines = multiLine.split('\n')
    const cleaned = lines.map(line => {
      const trimmed = line.trim()
      // Remove delimiter at the end of line
      if (trimmed.endsWith(` ${delimiter}`)) {
        return trimmed.slice(0, -(delimiter.length + 1))
      }
      return trimmed
    }).filter(line => line.length > 0)

    return cleaned.join(' ')
  }

  // Automatic live conversion effect
  useEffect(() => {
    const converted = convertToMultiLine(withoutBreaks, delimiter)
    setWithBreaks(converted)
  }, [withoutBreaks, delimiter])

  const handleCopy = (text: string, type: 'input' | 'output') => {
    navigator.clipboard.writeText(text)
    showToastNotification('Copied!')
  }

  const handleClear = (type: 'input' | 'output') => {
    if (type === 'input') {
      setWithoutBreaks('')
      setWithBreaks('')
    } else {
      setWithBreaks('')
    }
  }


  return (
    <div className="cli-command-breaks-container">
      {showToast && (
        <div className="cli-toast">
          {toastMessage}
        </div>
      )}
      <div className="cli-command-breaks-card">
        <h1 className="cli-command-breaks-title">CLI Command Line Breaks</h1>

        {/* Without line breaks section */}
        <div className="cli-section">
          <div className="cli-section-header">
            <div className="cli-tabs">
              <button
                className={`cli-tab ${inputTab === 'text' ? 'active' : ''}`}
                onClick={() => setInputTab('text')}
              >
                Text
              </button>
              <button
                className={`cli-tab ${inputTab === 'file' ? 'active' : ''}`}
                onClick={() => setInputTab('file')}
              >
                File
              </button>
            </div>
            <div className="cli-section-actions">
              <button
                className="cli-btn-outline"
                onClick={() => handleCopy(withoutBreaks, 'input')}
              >
                Copy
              </button>
              <button
                className="cli-btn-outline"
                onClick={() => handleClear('input')}
              >
                Delete
              </button>
            </div>
          </div>
          <label className="cli-section-label">Without line breaks</label>
          <div className="cli-textarea-container">
            <div className="cli-line-numbers">
              {withoutBreaks.split('\n').map((_, index) => (
                <div key={index} className="cli-line-number">{index + 1}</div>
              ))}
            </div>
            <textarea
              className="cli-textarea"
              value={withoutBreaks}
              onChange={(e) => setWithoutBreaks(e.target.value)}
              placeholder="Enter your command here..."
            />
          </div>
        </div>

        {/* Controls section */}
        <div className="cli-controls-section">
          <div className="cli-delimiter-control">
            <label className="cli-label">Line break delimiter:</label>
            <input
              type="text"
              className="cli-delimiter-input"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              placeholder="^"
              maxLength={5}
            />
          </div>
        </div>

        {/* With line breaks section */}
        <div className="cli-section">
          <div className="cli-section-header">
            <div className="cli-tabs">
              <button
                className={`cli-tab ${outputTab === 'text' ? 'active' : ''}`}
                onClick={() => setOutputTab('text')}
              >
                Text
              </button>
              <button
                className={`cli-tab ${outputTab === 'file' ? 'active' : ''}`}
                onClick={() => setOutputTab('file')}
              >
                File
              </button>
            </div>
            <div className="cli-section-actions">
              <button
                className="cli-btn-outline"
                onClick={() => handleCopy(withBreaks, 'output')}
              >
                Copy
              </button>
              <button
                className="cli-btn-outline"
                onClick={() => handleClear('output')}
              >
                Delete
              </button>
            </div>
          </div>
          <label className="cli-section-label">With line breaks</label>
          <div className="cli-textarea-container">
            <div className="cli-line-numbers">
              {withBreaks.split('\n').map((_, index) => (
                <div key={index} className="cli-line-number">{index + 1}</div>
              ))}
            </div>
            <textarea
              className="cli-textarea"
              value={withBreaks}
              onChange={(e) => setWithBreaks(e.target.value)}
              placeholder="Converted command with line breaks will appear here..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CliCommandBreaks

