'use client'

import { Tabs, TabsContent } from '@radix-ui/react-tabs'
import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

type Props = {
  fileReferenced: { fileName: string, summary: string, sourceCode: string }[]
}

const CodeReferences = ({ fileReferenced }: Props) => {
  const [tab, setTab] = React.useState(fileReferenced[0]?.fileName);
  const { theme } = useTheme();

  if (fileReferenced.length === 0) return null;

  return (
    <div className='max-w-[70vw]'>
      <Tabs value={tab} onValueChange={setTab}>
        <div className='overflow-scroll flex gap-2 bg-muted p-1 rounded-md'>
          {fileReferenced.map((file) => (
            <button
              onClick={() => setTab(file.fileName)}
              key={file.fileName}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:bg-accent',
                {
                  'bg-primary text-primary-foreground': tab === file.fileName,
                }
              )}
            >
              {file.fileName}
            </button>
          ))}
        </div>
        {fileReferenced.map(file => (
          <TabsContent
            key={file.fileName}
            value={file.fileName}
            className='max-h-[40vw] overflow-scroll max-w-7xl rounded-md'
          >
            <SyntaxHighlighter
              language="javascript"
              style={theme === 'dark' ? vscDarkPlus : vs}
              customStyle={{
                backgroundColor: theme === 'dark' ? '#1a1b26' : '#f5f5f5',
              }}
            >
              {file.sourceCode}
            </SyntaxHighlighter>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default CodeReferences;
