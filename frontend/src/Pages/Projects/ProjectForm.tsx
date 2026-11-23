import Buttons from "../../components/fields/Buttons"
import InputField from "../../components/fields/InputField"
import { useForm } from "react-hook-form"
import TextAreafield from "../../components/fields/TextAreafield"
import { useApiPostrequest } from "../../services/ApiMethods"
import { Routes } from "../../types"
import { toast } from "react-toastify"
import { useState } from "react"
import Spinner from "../../components/Loader/Spinner"
import { useQueryClient } from "@tanstack/react-query"

interface IFormInput {
    name: string,
    description: string,

}

interface props {
    onClose?: () => void
}

const ProjectForm = ({ onClose }: props) => {
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState<boolean>(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInput>({
        defaultValues: {
            name: '',
            description: ''
        }
    })

    //create project
    const addProject = useApiPostrequest()

    //createRoot Folder
    const RootFolderFn = useApiPostrequest()

    const onSubmit = (data: IFormInput) => {
        setLoading(true)
        const payload: IFormInput = {
            name: data?.name,
            description: data?.description
        }

        addProject.mutate({
            URL: Routes.CREATE_PROJECT,
            payload
        }, {
            onSuccess: (data: any) => {
                console.log('after creater project res', data)
                toast.success(`Successfully added project`)
                setLoading(false)
                queryClient.invalidateQueries({ queryKey: [Routes.GET_ALL_PROJECTS] })
                RootFolderFn.mutate({
                    URL: Routes.CREATE_ROOT_FOLDER,
                    payload: {
                        projectId: data?._id,
                        projectName: data?.name
                    }
                }, {
                    onSuccess: (data: any) => {
                        console.log('Root folder', data)
                    },
                    onError: (error: any) => {
                        toast.error(error?.response?.data?.message)
                    }
                })

                onClose?.()
                reset()
            },
            onError: (error: any) => {
                toast.error(`${error?.response?.data?.message}`)
                setLoading(false)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
            <InputField
                type="text"
                placeholder="Project name"
                {...register('name', { required: 'Project name required!' })}
                errors={errors.name}
                message={errors?.name?.message}
            />

            <TextAreafield
                rows={5}
                cols={5}
                placeholder="Project Description"
                {...register('description')}

            />

            <Buttons
                btnText={loading ? <Spinner /> : 'Create Project'}
                type='submit'
                disabled={loading}
            />

        </form>
    )
}

export default ProjectForm