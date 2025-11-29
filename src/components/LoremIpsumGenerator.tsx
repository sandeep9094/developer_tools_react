import { useState, useEffect, useCallback } from 'react'
import { loremIpsum } from 'lorem-ipsum'
import './LoremIpsumGenerator.css'

type GenerationType = 'paragraphs' | 'words' | 'bullets'

function LoremIpsumGenerator() {
  const [count, setCount] = useState(9)
  const [type, setType] = useState<GenerationType>('paragraphs')
  const [minWords, setMinWords] = useState(20)
  const [maxWords, setMaxWords] = useState(100)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [output, setOutput] = useState('')

  const generateLorem = useCallback(() => {
    let generated = ''

    if (type === 'paragraphs') {
      const paragraphs: string[] = []
      for (let i = 0; i < count; i++) {
        const paragraph = loremIpsum({
          count: Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords,
          units: 'words',
          format: 'plain',
        })
        paragraphs.push(paragraph)
      }

      if (startWithLorem && paragraphs.length > 0) {
        paragraphs[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paragraphs[0]
      }

      generated = paragraphs.map((para, index) => `${index + 1}. ${para}`).join('\n\n')
    } else if (type === 'words') {
      const words = loremIpsum({
        count: count,
        units: 'words',
        format: 'plain',
      })
      generated = startWithLorem 
        ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + words
        : words
    } else if (type === 'bullets') {
      const bullets: string[] = []
      for (let i = 0; i < count; i++) {
        const bullet = loremIpsum({
          count: Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords,
          units: 'words',
          format: 'plain',
        })
        bullets.push(bullet)
      }

      if (startWithLorem && bullets.length > 0) {
        bullets[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + bullets[0]
      }

      generated = bullets.map((bullet, index) => `• ${bullet}`).join('\n\n')
    }

    setOutput(generated)
  }, [count, type, minWords, maxWords, startWithLorem])

  // Generate on mount and when settings change
  useEffect(() => {
    generateLorem()
  }, [generateLorem])

  const handleRegenerate = () => {
    generateLorem()
  }

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output)
    }
  }

  const handleClear = () => {
    setOutput('')
  }

  return (
    <div className="lorem-container">
      <div className="lorem-card">
        <h2 className="lorem-title">Lorem Ipsum Generator</h2>

        <div className="lorem-controls">
          <div className="lorem-control-group">
            <div className="lorem-input-row">
              <input
                type="number"
                className="lorem-number-input"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <select
                className="lorem-type-select"
                value={type}
                onChange={(e) => setType(e.target.value as GenerationType)}
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="words">Words</option>
                <option value="bullets">Bullets</option>
              </select>
            </div>
          </div>

          {type === 'paragraphs' && (
            <div className="lorem-control-group">
              <div className="lorem-words-control">
                <label className="lorem-label">
                  Minimum words in paragraph:
                  <input
                    type="number"
                    className="lorem-words-input"
                    value={minWords}
                    onChange={(e) => setMinWords(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                </label>
                <label className="lorem-label">
                  Maximum:
                  <input
                    type="number"
                    className="lorem-words-input"
                    value={maxWords}
                    onChange={(e) => setMaxWords(Math.max(minWords, parseInt(e.target.value) || minWords))}
                    min={minWords}
                  />
                </label>
              </div>
            </div>
          )}

          {type === 'bullets' && (
            <div className="lorem-control-group">
              <div className="lorem-words-control">
                <label className="lorem-label">
                  Minimum words in bullet:
                  <input
                    type="number"
                    className="lorem-words-input"
                    value={minWords}
                    onChange={(e) => setMinWords(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                </label>
                <label className="lorem-label">
                  Maximum:
                  <input
                    type="number"
                    className="lorem-words-input"
                    value={maxWords}
                    onChange={(e) => setMaxWords(Math.max(minWords, parseInt(e.target.value) || minWords))}
                    min={minWords}
                  />
                </label>
              </div>
            </div>
          )}

          <div className="lorem-control-group">
            <label className="lorem-checkbox-label">
              <input
                type="checkbox"
                className="lorem-checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
              />
              <span className="lorem-checkbox-text">
                Start with iconic Lorem ipsum dolor sit amet...
              </span>
            </label>
          </div>

          <div className="lorem-actions">
            <button className="lorem-regenerate-button" onClick={handleRegenerate}>
              Regenerate
            </button>
          </div>
        </div>

        <div className="lorem-output-section">
          <div className="lorem-output-header">
            <h3 className="lorem-output-title">Generated lorem ipsum output:</h3>
            <div className="lorem-output-actions">
              <button 
                className="lorem-copy-button" 
                onClick={handleCopy}
                disabled={!output}
              >
                📋 Copy
              </button>
              <button 
                className="lorem-clear-button" 
                onClick={handleClear}
                disabled={!output}
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            className="lorem-output-textarea"
            value={output}
            readOnly
            placeholder="Generated Lorem Ipsum text will appear here..."
            rows={20}
          />
        </div>
      </div>
    </div>
  )
}

export default LoremIpsumGenerator

