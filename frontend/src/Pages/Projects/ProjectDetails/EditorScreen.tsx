import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import type { fileNode } from "../../../components/Folder/Folder"
import { useApiUpdateRequest } from "../../../services/ApiMethods"
import { Routes } from "../../../types"
import { toast } from "react-toastify"
import EditorTabs from "./EditorTabs"
import SelectedFileEditor from "./SelectedFileEditor"
import MonacoEditor from "../../../components/MonacoEditor/MonacoEditor"

interface props {
    openTab: fileNode[],
    activeTab: any,
    setActiveTab: Dispatch<SetStateAction<any>>,
    setOpenTabs: Dispatch<SetStateAction<any>>
}

const EditorScreen = ({ openTab, activeTab, setActiveTab, setOpenTabs }: props) => {
    const [saving, setSaving] = useState<boolean>(false)
    const [justSaved, setJustSaved] = useState<boolean>(false)
    const [code, setCode] = useState<any>('')

    const updateSave = useApiUpdateRequest()

    const save = async () => {
        if (!activeTab) return
        try {
            setSaving(true)
            updateSave.mutate({
                URL: `${Routes.UPDATE_FILE_BY_ID}/${activeTab?._id}`,
                payload: {
                    name: activeTab?.name,
                    content: code
                }
            }, {
                onSuccess: () => {
                    setSaving(false)
                    setActiveTab({ ...activeTab, content: code })
                    setOpenTabs((prev: any) => prev.map((t: any) => {
                        if (t._id === activeTab?._id) {
                            return {
                                ...t,
                                content: code
                            }
                        }
                        return t
                    }))
                    setJustSaved(true)
                    setTimeout(() => {
                        setJustSaved(false)
                    }, 1500)
                },
                onError: (error: any) => {
                    toast.error(`${error?.response?.data?.message}`)
                    setSaving(false)
                }
            })
        } catch (error: any) {
            toast.error(`${error?.response?.data?.message}`)
        }
    }

    useEffect(() => {
        setCode(activeTab?.content ?? '')
    }, [activeTab?._id, activeTab?.content])


    return (
        <div className="flex flex-1 flex-col bg-page">

            {/* Editor Tabs */}
            <EditorTabs
                openTab={openTab}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setOpenTabs={setOpenTabs}
            />

            {/* when select the file then show the file name with save button */}
            {
                activeTab &&
                <SelectedFileEditor
                    activeTab={activeTab}
                    onClick={save}
                    saving={saving}
                    justSaved={justSaved}
                />
            }

            {
                <div className="min-w-0 flex-1">
                    <MonacoEditor
                        handleEditorChange={(val, _) => setCode(val)}
                        language={activeTab?.language || 'plaintext'}
                        value={code}
                    />
                </div>
            }

        </div>
    )
}

export default EditorScreen