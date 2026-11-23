import Editor from "@monaco-editor/react";
interface props {
    handleEditorChange: (val: any, event: any) => void,
    language?: string,
    value?: any
}
const MonacoEditor = ({
    handleEditorChange,
    language,
    value
}: props) => {
    return (
        <Editor
            height="100%"
            theme="vs-dark"
            language={language || 'plaintext'}
            value={value}
            onChange={handleEditorChange}
            options={{
                fontSize: 14,
                automaticLayout: true,
                minimap: { enabled: false },
                wordWrap: "on",
                scrollBeyondLastLine: false,
                padding: { top: 12 }
            }}
        />
    )
}

export default MonacoEditor