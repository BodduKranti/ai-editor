import { FolderOpen } from "lucide-react";

const EmptyProjects = () => {
    return (
        <div
            className="
        mt-5 flex flex-col items-center justify-center text-center
        rounded-2xl border border-dashed px-6 py-14
        border-slate-300 bg-white/60
        dark:border-slate-700/70 dark:bg-white/2
      "
        >
            <div
                className="
          mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border
          border-slate-200 bg-slate-100 text-slate-500
          dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400
        "
            >
                <FolderOpen className="h-7 w-7" strokeWidth={1.5} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                No projects yet
            </h3>
            <p className="mt-1.5 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                Create your first project and it will show up here, ready to open anytime.
            </p>

        </div>
    );
}

export default EmptyProjects
