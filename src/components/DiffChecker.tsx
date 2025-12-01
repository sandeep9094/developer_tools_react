import { useState } from 'react'
import { diffLines } from 'diff'
import './DiffChecker.css'

interface DiffLine {
  value: string
  type: 'added' | 'removed' | 'unchanged'
  lineNumber: number
}

function DiffChecker() {
  const [originalText, setOriginalText] = useState('')
  const [modifiedText, setModifiedText] = useState('')
  const [originalLines, setOriginalLines] = useState<DiffLine[]>([])
  const [modifiedLines, setModifiedLines] = useState<DiffLine[]>([])
  const [hasChecked, setHasChecked] = useState(false)

  const calculateDiff = () => {
    if (!originalText && !modifiedText) {
      setOriginalLines([])
      setModifiedLines([])
      setHasChecked(false)
      return
    }

    const diff = diffLines(originalText, modifiedText)
    const origLines: DiffLine[] = []
    const modLines: DiffLine[] = []
    let origLineNum = 1
    let modLineNum = 1

    diff.forEach((part) => {
      const lines = part.value.split('\n')
      // Remove the last empty line if it exists (split always adds one)
      if (lines.length > 0 && lines[lines.length - 1] === '') {
        lines.pop()
      }

      if (part.added) {
        // These lines only exist in modified
        lines.forEach((line) => {
          modLines.push({
            value: line,
            type: 'added',
            lineNumber: modLineNum++,
          })
          // Add empty line to original to keep alignment
          origLines.push({
            value: '',
            type: 'unchanged',
            lineNumber: origLineNum++,
          })
        })
      } else if (part.removed) {
        // These lines only exist in original
        lines.forEach((line) => {
          origLines.push({
            value: line,
            type: 'removed',
            lineNumber: origLineNum++,
          })
          // Add empty line to modified to keep alignment
          modLines.push({
            value: '',
            type: 'unchanged',
            lineNumber: modLineNum++,
          })
        })
      } else {
        // Unchanged lines
        lines.forEach((line) => {
          origLines.push({
            value: line,
            type: 'unchanged',
            lineNumber: origLineNum++,
          })
          modLines.push({
            value: line,
            type: 'unchanged',
            lineNumber: modLineNum++,
          })
        })
      }
    })

    setOriginalLines(origLines)
    setModifiedLines(modLines)
    setHasChecked(true)
  }

  const handleDiffCheck = () => {
    calculateDiff()
  }

  const handleCopyOriginal = () => {
    if (originalText) {
      navigator.clipboard.writeText(originalText)
    }
  }

  const handleCopyModified = () => {
    if (modifiedText) {
      navigator.clipboard.writeText(modifiedText)
    }
  }

  const handleClear = () => {
    setOriginalText('')
    setModifiedText('')
    setOriginalLines([])
    setModifiedLines([])
    setHasChecked(false)
  }

  const renderLine = (line: DiffLine, side: 'left' | 'right') => {
    const className = `diff-line diff-line-${line.type} ${
      line.value === '' ? 'diff-line-empty' : ''
    }`
    
    return (
      <div key={`${side}-${line.lineNumber}`} className={className}>
        <span className="diff-line-number">{line.lineNumber}</span>
        <span className="diff-line-content">
          {line.value || '\u00A0'}
        </span>
      </div>
    )
  }

  return (
    <div className="diff-container">
      <div className="diff-card">
        <h2 className="diff-title">Difference Checker</h2>
        <p className="diff-subtitle">
          Compare two versions of text and see the differences highlighted line by line.
          Red highlights indicate removals, green highlights indicate additions.
        </p>

        <div className="diff-input-section">
          <div className="diff-input-group">
            <div className="diff-input-header">
              <label htmlFor="original" className="diff-input-label">Original Text</label>
              <button 
                className="copy-button" 
                onClick={handleCopyOriginal} 
                disabled={!hasChecked}
                title="Copy original text"
              >
                📋 Copy
              </button>
            </div>
            <textarea
              id="original"
              className="diff-textarea"
              value={originalText}
              onChange={(e) => {
                setOriginalText(e.target.value)
                setHasChecked(false)
              }}
              placeholder="Paste or type original text here..."
              rows={15}
            />
          </div>

          <div className="diff-input-group">
            <div className="diff-input-header">
              <label htmlFor="modified" className="diff-input-label">Modified Text</label>
              <button 
                className="copy-button" 
                onClick={handleCopyModified} 
                disabled={!hasChecked}
                title="Copy modified text"
              >
                📋 Copy
              </button>
            </div>
            <textarea
              id="modified"
              className="diff-textarea"
              value={modifiedText}
              onChange={(e) => {
                setModifiedText(e.target.value)
                setHasChecked(false)
              }}
              placeholder="Paste or type modified text here..."
              rows={15}
            />
          </div>
        </div>

        <div className="diff-actions">
          <button className="diff-check-button" onClick={handleDiffCheck}>
            Diff Check
          </button>
          <button className="clear-button" onClick={handleClear}>
            Clear All
          </button>
        </div>

        {(originalLines.length > 0 || modifiedLines.length > 0) && (
          <div className="diff-result-section">
            <h3 className="diff-result-title">Differences</h3>
            <div className="diff-view">
              <div className="diff-panel diff-panel-left">
                <div className="diff-panel-header">
                  <span className="diff-panel-label">Original</span>
                  <span className="diff-panel-count">
                    {originalLines.filter((l) => l.type === 'removed').length} removals
                  </span>
                </div>
                <div className="diff-lines-container">
                  {originalLines.map((line) => renderLine(line, 'left'))}
                </div>
              </div>

              <div className="diff-panel diff-panel-right">
                <div className="diff-panel-header">
                  <span className="diff-panel-label">Modified</span>
                  <span className="diff-panel-count">
                    {modifiedLines.filter((l) => l.type === 'added').length} additions
                  </span>
                </div>
                <div className="diff-lines-container">
                  {modifiedLines.map((line) => renderLine(line, 'right'))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiffChecker

