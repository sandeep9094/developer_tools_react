import { useState, useEffect } from 'react'
import { Buffer } from 'buffer'
import './JwtDecoder.css'

interface JwtDecoderProps {}

function JwtDecoder({}: JwtDecoderProps) {
  const [encodedToken, setEncodedToken] = useState('')
  const [headerJson, setHeaderJson] = useState('')
  const [payloadJson, setPayloadJson] = useState('')
  const [liveConversion, setLiveConversion] = useState(true)
  const [isValidJwt, setIsValidJwt] = useState(false)
  const [isValidSignature, setIsValidSignature] = useState<boolean | null>(null)
  const [secret, setSecret] = useState('')
  const [secretEncoding, setSecretEncoding] = useState('UTF-8')

  // Base64Url encoding/decoding
  const base64UrlEncode = (str: string): string => {
    return Buffer.from(str, 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  const base64UrlEncodeBytes = (bytes: Uint8Array): string => {
    return Buffer.from(bytes)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  const base64UrlDecode = (str: string): string => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4) {
      base64 += '='
    }
    try {
      return Buffer.from(base64, 'base64').toString('utf8')
    } catch {
      return ''
    }
  }

  // HMAC-SHA256 signature generation
  const generateSignature = async (header: string, payload: string, secret: string): Promise<string> => {
    const data = `${header}.${payload}`
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const messageData = encoder.encode(data)

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signature = await crypto.subtle.sign('HMAC', key, messageData)
    return base64UrlEncodeBytes(new Uint8Array(signature))
  }

  // Verify signature
  const verifySignature = async (header: string, payload: string, signature: string, secret: string): Promise<boolean> => {
    try {
      const expectedSignature = await generateSignature(header, payload, secret)
      return expectedSignature === signature
    } catch {
      return false
    }
  }

  // Format JSON with indentation
  const formatJson = (json: string): string => {
    try {
      const parsed = JSON.parse(json)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return json
    }
  }


  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Decode JWT token
  const decodeToken = async (token: string) => {
    try {
      if (!token.trim()) {
        setHeaderJson('')
        setPayloadJson('')
        setIsValidJwt(false)
        setIsValidSignature(null)
        return
      }

      const parts = token.trim().split('.')
      if (parts.length !== 3) {
        setHeaderJson('')
        setPayloadJson('')
        setIsValidJwt(false)
        setIsValidSignature(null)
        return
      }

      setIsValidJwt(true)
      const [headerPart, payloadPart, signaturePart] = parts
      
      const headerDecoded = base64UrlDecode(headerPart)
      const payloadDecoded = base64UrlDecode(payloadPart)

      if (headerDecoded) {
        setHeaderJson(formatJson(headerDecoded))
      } else {
        setHeaderJson('')
      }
      if (payloadDecoded) {
        setPayloadJson(formatJson(payloadDecoded))
      } else {
        setPayloadJson('')
      }

      // Verify signature if secret is provided
      if (secret) {
        try {
          const isValid = await verifySignature(headerPart, payloadPart, signaturePart, secret)
          setIsValidSignature(isValid)
        } catch {
          setIsValidSignature(false)
        }
      } else {
        setIsValidSignature(null)
      }
    } catch (err) {
      console.error('Error decoding token:', err)
      setHeaderJson('')
      setPayloadJson('')
      setIsValidJwt(false)
      setIsValidSignature(null)
    }
  }

  // Encode JWT token
  const encodeToken = async () => {
    try {
      const header = base64UrlEncode(headerJson)
      const payload = base64UrlEncode(payloadJson)
      
      let signature = ''
      if (secret) {
        signature = await generateSignature(header, payload, secret)
      } else {
        const randomBytes = new Uint8Array(32)
        crypto.getRandomValues(randomBytes)
        signature = base64UrlEncodeBytes(randomBytes)
      }

      const token = `${header}.${payload}.${signature}`
      setEncodedToken(token)
      setIsValidJwt(true)
      setIsValidSignature(secret ? true : null)
    } catch (err) {
      console.error('Error encoding token:', err)
    }
  }

  // Generate example JWT
  const generateExampleJwt = async () => {
    const exampleHeader = {
      alg: 'HS256',
      typ: 'JWT'
    }

    const examplePayload = {
      sub: '1234567890',
      name: 'John Doe',
      admin: true,
      iat: 1516239022
    }

    setHeaderJson(JSON.stringify(exampleHeader, null, 2))
    setPayloadJson(JSON.stringify(examplePayload, null, 2))

    const exampleSecret = 'a-string-secret-at-least-256-bits-long.'
    setSecret(exampleSecret)

    const header = base64UrlEncode(JSON.stringify(exampleHeader))
    const payload = base64UrlEncode(JSON.stringify(examplePayload))
    const signature = await generateSignature(header, payload, exampleSecret)
    
    const token = `${header}.${payload}.${signature}`
    setEncodedToken(token)
    setIsValidJwt(true)
    setIsValidSignature(true)
  }

  // Live conversion effect
  useEffect(() => {
    if (liveConversion && encodedToken) {
      decodeToken(encodedToken).catch(err => {
        console.error('Error in live conversion:', err)
      })
    } else if (!encodedToken) {
      setHeaderJson('')
      setPayloadJson('')
      setIsValidJwt(false)
      setIsValidSignature(null)
    }
  }, [encodedToken, liveConversion, secret])

  const handleCopy = (text: string) => {
    copyToClipboard(text)
  }

  const handleClear = (type: 'encoded' | 'header' | 'payload' | 'secret') => {
    if (type === 'encoded') {
      setEncodedToken('')
      setHeaderJson('')
      setPayloadJson('')
      setIsValidJwt(false)
      setIsValidSignature(null)
    } else if (type === 'header') {
      setHeaderJson('')
    } else if (type === 'payload') {
      setPayloadJson('')
    } else if (type === 'secret') {
      setSecret('')
      setIsValidSignature(null)
    }
  }

  return (
    <div className="jwt-decoder-container">
      <div className="jwt-decoder-card">
        <div className="jwt-main-layout">
          {/* Left Panel - Encoded Value */}
          <div className="jwt-encoded-panel">
            <div className="jwt-panel-header">
              <div>
                <h2 className="jwt-panel-title">ENCODED VALUE</h2>
                <p className="jwt-panel-subtitle">JSON WEB TOKEN (JWT)</p>
              </div>
              <div className="jwt-panel-actions">
                <button className="jwt-btn-outline" onClick={() => handleCopy(encodedToken)}>
                  COPY
                </button>
                <button className="jwt-btn-outline" onClick={() => handleClear('encoded')}>
                  CLEAR
                </button>
              </div>
            </div>
            
            {isValidJwt && (
              <div className="jwt-status-indicators">
                <div className="jwt-status-valid">Valid JWT</div>
                {isValidSignature !== null && isValidSignature && (
                  <div className="jwt-status-valid">Signature Verified</div>
                )}
              </div>
            )}

            <textarea
              className="jwt-encoded-textarea"
              value={encodedToken}
              onChange={(e) => setEncodedToken(e.target.value)}
              placeholder="Enter JWT token here..."
            />
          </div>

          {/* Right Panel - Decoded Sections */}
          <div className="jwt-decoded-panel">
            {/* Header Section */}
            <div className="jwt-decoded-section">
              <div className="jwt-section-header">
                <h3 className="jwt-section-title">DECODED HEADER</h3>
                <div className="jwt-section-actions">
                  <button className="jwt-btn-outline" onClick={() => handleCopy(headerJson)}>
                    COPY
                  </button>
                  <button className="jwt-btn-outline" onClick={() => handleClear('header')}>
                    CLEAR
                  </button>
                </div>
              </div>
              
              <div className="jwt-content-area">
                <textarea
                  className="jwt-json-textarea"
                  value={headerJson}
                  onChange={(e) => setHeaderJson(e.target.value)}
                  placeholder='{\n  "alg": "HS256",\n  "typ": "JWT"\n}'
                />
              </div>
            </div>

            {/* Payload Section */}
            <div className="jwt-decoded-section">
              <div className="jwt-section-header">
                <h3 className="jwt-section-title">DECODED PAYLOAD</h3>
                <div className="jwt-section-actions">
                  <button className="jwt-btn-outline" onClick={() => handleCopy(payloadJson)}>
                    COPY
                  </button>
                  <button className="jwt-btn-outline" onClick={() => handleClear('payload')}>
                    CLEAR
                  </button>
                </div>
              </div>
              
              <div className="jwt-content-area">
                <textarea
                  className="jwt-json-textarea"
                  value={payloadJson}
                  onChange={(e) => setPayloadJson(e.target.value)}
                  placeholder='{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}'
                />
              </div>
            </div>

            {/* Signature Verification Section */}
            <div className="jwt-decoded-section">
              <div className="jwt-section-header">
                <h3 className="jwt-section-title">JWT SIGNATURE VERIFICATION (OPTIONAL)</h3>
              </div>
              
              <p className="jwt-instruction">Enter the secret used to sign the JWT below:</p>
              
              <div className="jwt-secret-controls">
                <div className="jwt-secret-label-row">
                  <label className="jwt-secret-label-text">SECRET</label>
                  <div className="jwt-panel-actions">
                    <button className="jwt-btn-outline" onClick={() => handleCopy(secret)}>
                      COPY
                    </button>
                    <button className="jwt-btn-outline" onClick={() => handleClear('secret')}>
                      CLEAR
                    </button>
                  </div>
                </div>
                
                {isValidSignature !== null && secret && (
                  <div className={`jwt-status-valid ${isValidSignature ? '' : 'invalid'}`}>
                    {isValidSignature ? 'Valid secret' : 'Invalid secret'}
                  </div>
                )}

                <input
                  type="text"
                  className="jwt-secret-input"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter secret key..."
                />

                <div className="jwt-encoding-format">
                  <label className="jwt-encoding-label">
                    Encoding Format:
                    <select
                      className="jwt-encoding-select"
                      value={secretEncoding}
                      onChange={(e) => setSecretEncoding(e.target.value)}
                    >
                      <option value="UTF-8">UTF-8</option>
                      <option value="Base64">Base64</option>
                      <option value="Hex">Hex</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Example Button */}
        <div className="jwt-generate-section">
          <button className="jwt-btn-generate" onClick={generateExampleJwt}>
            Generate Example
          </button>
        </div>
      </div>
    </div>
  )
}

export default JwtDecoder
