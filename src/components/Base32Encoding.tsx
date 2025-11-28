import { useState, useEffect } from 'react'
import { encode, decode } from 'base32.js'
import { Buffer } from 'buffer'
import './Base32Encoding.css'

interface Base32EncodingProps {
  mode: 'encode' | 'decode'
}

type EncodingType = 'UTF-8' | 'UTF-16' | 'ASCII' | 'Hex' | 'Base64'

function Base32Encoding({ mode }: Base32EncodingProps) {
  // Store inputs separately for each mode
  const [encodeInput, setEncodeInput] = useState('')
  const [decodeInput, setDecodeInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  
  // Store encoding settings separately for each mode
  const [encodeInputEncoding, setEncodeInputEncoding] = useState<EncodingType>('UTF-8')
  const [decodeOutputEncoding, setDecodeOutputEncoding] = useState<EncodingType>('UTF-8')

  // Get current input and setter based on mode
  const input = mode === 'encode' ? encodeInput : decodeInput
  const inputEncoding = mode === 'encode' ? encodeInputEncoding : 'UTF-8'
  const outputEncoding = mode === 'decode' ? decodeOutputEncoding : 'UTF-8'

  // Update input based on mode
  const setInput = (value: string) => {
    if (mode === 'encode') {
      setEncodeInput(value)
    } else {
      setDecodeInput(value)
    }
  }

  // Clear output and error when mode changes (but keep inputs)
  useEffect(() => {
    setOutput('')
    setError('')
  }, [mode])

  // Convert input based on encoding type
  const getInputBuffer = (text: string): Buffer => {
    switch (inputEncoding) {
      case 'UTF-8':
        return Buffer.from(text, 'utf8')
      case 'UTF-16':
        return Buffer.from(text, 'utf16le')
      case 'ASCII':
        return Buffer.from(text, 'ascii')
      case 'Hex':
        // Remove spaces and convert hex string to buffer
        const hexString = text.replace(/\s/g, '')
        if (!/^[0-9A-Fa-f]*$/.test(hexString)) {
          throw new Error('Invalid hex string')
        }
        return Buffer.from(hexString, 'hex')
      case 'Base64':
        return Buffer.from(text, 'base64')
      default:
        return Buffer.from(text, 'utf8')
    }
  }

  // Add padding to Base32 string
  const addBase32Padding = (encoded: string): string => {
    const remainder = encoded.length % 8
    if (remainder === 0) return encoded
    const padding = '='.repeat(8 - remainder)
    return encoded + padding
  }

  // Convert buffer to output based on encoding type
  const getOutputString = (buffer: Uint8Array): string => {
    if (!buffer || buffer.length === 0) return ''
  
    try {
      const nodeBuffer = Buffer.from(buffer)
      const encoding = outputEncoding.toUpperCase()
  
      switch (encoding) {
        case 'UTF-8':
          return nodeBuffer.toString('utf8')
  
        case 'UTF-16':
        case 'UTF16':
        case 'UTF-16LE':
          return nodeBuffer.toString('utf16le')
  
        case 'ASCII':
          return nodeBuffer.toString('ascii')
  
        case 'HEX':
          return nodeBuffer.toString('hex').toUpperCase()
  
        case 'BASE64':
          return nodeBuffer.toString('base64')
  
        default:
          return nodeBuffer.toString('utf8')
      }
    } catch {
      try {
        return Buffer.from(buffer).toString('utf8')
      } catch {
        return ''
      }
    }
  }
  
  

  // Auto-update on input change
  useEffect(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      setError('')
      if (mode === 'encode') {
        const buffer = getInputBuffer(input)
        const encoded = encode(buffer)
        const padded = addBase32Padding(encoded)
        setOutput(padded)
      } else {
        // Remove whitespace and convert to uppercase for Base32 decoding
        // Base32 uses A-Z, 2-7, and = for padding
        let cleanedInput = input.replace(/\s/g, '').toUpperCase()
        // Keep only valid Base32 characters (A-Z, 2-7, and =)
        cleanedInput = cleanedInput.replace(/[^A-Z2-7=]/g, '')
        
        if (!cleanedInput || cleanedInput.replace(/=/g, '').length === 0) {
          setOutput('')
          return
        }
        
        try {
          const buffer = decode(cleanedInput)
          if (buffer && buffer.length > 0) {
            const decoded = getOutputString(buffer)
            if (decoded) {
              setOutput(decoded)
            } else {
              setOutput('')
            }
          } else {
            setOutput('')
          }
        } catch (decodeErr) {
          // If decoding fails with padding, try without padding
          try {
            const withoutPadding = cleanedInput.replace(/=/g, '')
            if (withoutPadding.length > 0) {
              const buffer = decode(withoutPadding)
              if (buffer && buffer.length > 0) {
                const decoded = getOutputString(buffer)
                if (decoded) {
                  setOutput(decoded)
                } else {
                  setOutput('')
                }
              } else {
                setOutput('')
              }
            } else {
              setOutput('')
            }
          } catch (err2) {
            // Silent error for auto-update - don't show error on every keystroke
            setOutput('')
          }
        }
      }
    } catch (err) {
      // Silent error for auto-update
      setError('')
      setOutput('')
    }
  }, [input, mode, inputEncoding, outputEncoding])

  const handleEncode = () => {
    try {
      setError('')
      if (!input.trim()) {
        setOutput('')
        return
      }

      const buffer = getInputBuffer(input)
      const encoded = encode(buffer)
      const padded = addBase32Padding(encoded)
      setOutput(padded)
    } catch (err) {
      setError('Error encoding: ' + (err instanceof Error ? err.message : 'Unknown error'))
      setOutput('')
    }
  }

  const handleDecode = () => {
    try {
      setError("")
      if (!input.trim()) {
        setOutput("")
        return
      }
  
      // Remove whitespace and convert to uppercase for Base32 decoding
      let cleaned = input.replace(/\s/g, "").toUpperCase()
      // Keep only valid Base32 characters (A-Z, 2-7, and =)
      cleaned = cleaned.replace(/[^A-Z2-7=]/g, "")
  
      if (!cleaned || cleaned.replace(/=/g, "").length === 0) {
        setError("Invalid Base32 string")
        setOutput("")
        return
      }
  
      // Decode Base32 to buffer
      const buffer = decode(cleaned)
  
      if (!buffer || buffer.length === 0) {
        setError("Decoded buffer is empty")
        setOutput("")
        return
      }
  
      // Convert buffer to text using the selected output encoding
      const decodedText = getOutputString(buffer)
      
      if (decodedText) {
        setOutput(decodedText)
      } else {
        setError("Failed to convert buffer to text")
        setOutput("")
      }
    } catch (err) {
      setError("Error decoding: " + (err instanceof Error ? err.message : "Invalid Base32 string"))
      setOutput("")
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    setError('')
  }

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output)
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div className="encoding-container">
      <div className="encoding-card">
        <h2 className="encoding-title">
          {mode === 'encode' ? 'Base32 Encoding' : 'Base32 Decoding'}
        </h2>
        <p className="encoding-subtitle">
          This online Base32 {mode === 'encode' ? 'encoding' : 'decoding'} tool helps you {mode === 'encode' ? 'encode' : 'decode'} text or binary to Base32. 
          You can input UTF-8, UTF-16, Hex, Base64, or other encodings.
        </p>

        {mode === 'encode' && (
          <div className="encoding-selectors">
            <div className="encoding-selector-group">
              <label htmlFor="input-encoding" className="encoding-selector-label">
                Input Encoding
              </label>
              <select
                id="input-encoding"
                className="encoding-select"
                value={inputEncoding}
              onChange={(e) => {
                setEncodeInputEncoding(e.target.value as EncodingType)
                setEncodeInput('')
                setOutput('')
              }}
              >
                <option value="UTF-8">UTF-8</option>
                <option value="UTF-16">UTF-16</option>
                <option value="ASCII">ASCII</option>
                <option value="Hex">Hex</option>
                <option value="Base64">Base64</option>
              </select>
            </div>
          </div>
        )}

        {mode === 'decode' && (
          <div className="encoding-selectors">
            <div className="encoding-selector-group">
              <label htmlFor="output-encoding" className="encoding-selector-label">
                Output Encoding
              </label>
              <select
                id="output-encoding"
                className="encoding-select"
                value={outputEncoding}
              onChange={(e) => {
                setDecodeOutputEncoding(e.target.value as EncodingType)
                setOutput('')
              }}
              >
                <option value="UTF-8">UTF-8</option>
                <option value="UTF-16">UTF-16</option>
                <option value="ASCII">ASCII</option>
                <option value="Hex">Hex</option>
                <option value="Base64">Base64</option>
              </select>
            </div>
          </div>
        )}

        <div className="io-container">
          <div className="io-section">
            <label htmlFor="input" className="io-label">Input</label>
            <textarea
              id="input"
              className="io-textarea"
              value={input}
              onChange={handleInputChange}
              placeholder={mode === 'encode' ? 'Paste your text here...' : 'Paste your Base32 string here...'}
              rows={12}
            />
          </div>

          <div className="io-section">
            <label htmlFor="output" className="io-label">Output</label>
            <textarea
              id="output"
              className="io-textarea"
              value={output}
              readOnly
              placeholder="Result will appear here..."
              rows={12}
            />
          </div>
        </div>

        <div className="action-buttons-row">
          {mode === 'encode' ? (
            <button className="encode-button" onClick={handleEncode}>
              <span className="button-icon">↓</span>
              Encode
            </button>
          ) : (
            <button className="encode-button" onClick={handleDecode}>
              <span className="button-icon">↑</span>
              Decode
            </button>
          )}
          <button className="copy-button" onClick={handleCopy} disabled={!output}>
            <span className="button-icon">📋</span>
            Copy Output
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default Base32Encoding
