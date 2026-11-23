import { FileText, ImageIcon, KeyRound, Lock, Package, Settings2 } from "lucide-react"
import { IoLogoJavascript, IoLogoReact } from 'react-icons/io5'
import { SiTypescript } from 'react-icons/si'
import { FaCss3, FaHtml5, FaPython } from 'react-icons/fa'
import { BsFiletypeJson, BsFiletypeCss } from 'react-icons/bs'
export const getFileIcon = (name = "") => {
    const lower = name.toLowerCase()
    const extension: string = lower.split(".").pop() || ""

    const knownNames: any = {
        "package.json": { icon: Package, color: "text-emerald-400" },
        "package-lock.json": { icon: Lock, color: "text-zinc-500" },
        ".env": { icon: KeyRound, color: "text-lime-400" },
    }

    if (knownNames[lower]) return knownNames[lower]

    const map: any = {
        js: { icon: IoLogoJavascript, color: "text-yellow-400" },
        mjs: { icon: IoLogoJavascript, color: "text-yellow-400" },
        cjs: { icon: IoLogoJavascript, color: "text-yellow-400" },
        jsx: { icon: IoLogoReact, color: "text-sky-400" },
        tsx: { icon: IoLogoReact, color: "text-sky-600" },
        ts: { icon: SiTypescript, color: "text-blue-600" },
        json: { icon: BsFiletypeJson, color: "text-abmer-400" },
        css: { icon: FaCss3, color: "text-violet-400" },
        scss: { icon: BsFiletypeCss, color: "text-pink-400" },
        html: { icon: FaHtml5, color: "text-orange-400" },
        md: { icon: FileText, color: "text-zinc-300" },
        mdx: { icon: FileText, color: "text-zinc-300" },
        py: { icon: FaPython, color: "text-emerald-400" },
        yml: { icon: Settings2, color: "text-rose-400" },
        yaml: { icon: Settings2, color: "text-rose-400" },
        png: { icon: ImageIcon, color: "text-green-400" },
        jpg: { icon: ImageIcon, color: "text-green-400" },
        jpeg: { icon: ImageIcon, color: "text-green-400" },
        svg: { icon: ImageIcon, color: "text-green-400" },
        gif: { icon: ImageIcon, color: "text-green-400" },
        webp: { icon: ImageIcon, color: "text-green-400" },
        ico: { icon: ImageIcon, color: "text-green-400" },
        txt: { icon: FileText, color: "text-pink-400" },
    }

    return map[extension] || { icon: FileText, color: "text-pink-400" }
}


export const getFoldercolor = (name = "") => {
    const key: any = name.toLowerCase()
    const map: any = {
        src: 'text-sky-400',
        public: 'text-emerald-400',
        images: 'text-green-400',
        img: 'text-green-400',
        assets: 'text-pinl-400',
        css: 'text-violet-400',
        styles: 'text-violet-400',
        js: 'text-yellow-400',
        scripts: 'text-yellow-400',
        components: 'text-sky-400',
        pages: 'text-sky-400',
        utils: 'text-amber-400',
        hooks: 'text-teal-400',
        node_modules: 'text-zinc-600',
        dist: 'text-zinc-500',
        build: 'text-zinc-500',
    }

    return map[key] || 'text-sky-400'
}