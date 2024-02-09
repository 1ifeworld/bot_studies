'use client'

import React, { useEffect, useState, useRef } from 'react'
import Viewer from 'rich-markdown-editor'

interface MarkdownRendererProps {
  contentUrl: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ contentUrl }) => {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    setIsLoading(true)
    fetch(contentUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.text()
      })
      .then((data) => {
        setContent(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching Markdown content:', error)
        setIsLoading(false)
      })
  }, [contentUrl])

  const viewerStyles = {
    lineHeight: '17px',
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center bg-white overflow-auto h-[95vh] px-2 py-10 sm:px-10">
      <div className="w-full base max-w-2xl mx-auto" style={{ width: '70vw' }}>
        {isLoading ? (
          <div className="flex base justify-center items-center h-full">
            Loading...
          </div>
        ) : (
          <Viewer
            className="max-w-none base"
            value={content}
            readOnly
            style={viewerStyles}
          />
        )}
      </div>
    </div>
  );
};

export default MarkdownRenderer;