import { PlusIcon } from "lucide-react"
import PageShowUsername from "../../components/PageShowUsername/PageShowUsername"
import Buttons from "../../components/fields/Buttons"
import ProjectList from "./ProjectList"
import ProjectForm from "./ProjectForm"
import { useState } from "react"
import ModalPopup from "../../components/ModalPopup/ModalPopup"


const Projects = () => {
    const [openProjectform, setOpenProjectform] = useState<boolean>(false)
    return (
        <>
            <div className="mb-8 grid grid-cols-1 md:flex items-start justify-between gap-3">
                <PageShowUsername />
                <Buttons
                    btnText="New Project"
                    btnIcon={<PlusIcon size={16} />}
                    type="button"
                    onClick={() => setOpenProjectform(true)}
                />
            </div>



            <div className="my-4 flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white">
                    Recent Projects
                </h2>
            </div>

            <ModalPopup
                open={openProjectform}
                onClose={() => setOpenProjectform(false)}
                children={<ProjectForm onClose={() => setOpenProjectform(false)} />}
                modalTitle="Create Project"
                modalDesc="Set up a new workspace in seconds"
            />

            <ProjectList />
        </>

    )
}

export default Projects