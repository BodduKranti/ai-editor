import PageShowUsername from "../../components/PageShowUsername/PageShowUsername"
import StarredProjectlist from "./StarredProjectlist"

const Starred = () => {
    return (
        <>
            <div className="mb-8 flex items-start justify-between">
                <PageShowUsername />
            </div>
            <div className="my-4 flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white">
                    Starred Projects
                </h2>
            </div>

            <StarredProjectlist />
        </>
    )
}

export default Starred