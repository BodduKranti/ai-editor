import EmptyProjects from "../../components/EmptyProjects/EmptyProjects"
import { useApiGetRequest } from "../../services/ApiMethods"
import { Routes } from "../../types"
import ProjectListItem from "../Projects/ProjectListItem"

const StarredProjectlist = () => {
    const { data } = useApiGetRequest(Routes.GET_ALL_STARRED_PORJECTS)
    const allStarredProjects = Array.isArray(data) && data || []
    return (
        <div className="w-full">
            {allStarredProjects?.length > 0 ?
                (
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {
                            allStarredProjects?.map((list) => <ProjectListItem list={list} key={list?._id} />)
                        }
                    </div>
                ) :
                (<EmptyProjects />)}
        </div>
    )
}

export default StarredProjectlist