import { useMemo } from "react"

interface PreviewScreenProps {
    getTree: any[]
}

const PreviewScreen = ({ getTree }: PreviewScreenProps) => {
    const srcDoc = useMemo(() => {
        let html = ''
        let css = ''
        let js = ''

        const walk = (items: any[]) => {
            for (const item of items) {
                if (item?.type === 'file') {
                    const name = item?.name?.toLowerCase() ?? ''

                    if (name === 'index.html') {
                        html = item?.content || ''
                    } else if (name.endsWith('.css')) {
                        css += (item?.content || '') + '\n'
                    } else if (name.endsWith('.js')) {
                        js += (item?.content || '') + '\n'
                    }
                }
                if (item?.children?.length) walk(item.children)
            }
        }

        walk(getTree || [])

        if (!html) {
            return `<!DOCTYPE html>
<html>
    <body style="margin:0;background:#0a0a0c;color:#999;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;">
        <div style="text-align:center">
            <h3 style="margin:0 0 6px;">No index.html found</h3>
            <p style="margin:0;font-size:13px;color:#666666">Create HTML project to see the preview</p>
        </div>
    </body>
</html>`
        }

        // Remove references to local files (they can't load inside srcDoc)
        html = html
            .replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '')
            .replace(/<script[^>]*src=["'][^"']*["'][^>]*>\s*<\/script>/gi, '')

        // Inject CSS
        if (css) {
            const style = `<style>\n${css}\n</style>`
            html = html.includes('</head>')
                ? html.replace('</head>', `${style}</head>`)
                : style + html
        }

        // Inject JS
        if (js) {
            const script = `<script>\n${js}\n<\/script>`
            html = html.includes('</body>')
                ? html.replace('</body>', `${script}</body>`)
                : html + script
        }

        return html
    }, [getTree])

    return (
        <div className="flex h-full w-full flex-col bg-white">
            <div className="flex h-10 shrink-0 items-center justify-between bg-[#111113] px-4">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-zinc-300">Preview</span>
                </div>
            </div>

            <div className="min-h-0 flex-1 bg-white">
                <iframe
                    title="Project Preview"
                    srcDoc={srcDoc}
                    sandbox="allow-scripts allow-forms allow-modals"
                    className="h-full w-full border-0"
                />
            </div>
        </div>
    )
}

export default PreviewScreen