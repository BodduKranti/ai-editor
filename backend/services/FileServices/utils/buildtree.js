export const buildTree = (files) => {
    const map = {}
    const tree = []

    //below format we will create
    // map={
    //     id:{
    //         file,
    //         children:[]
    //     }
    // }

    // First pass: create a node for every file, each with an empty children array
    files.forEach(file => {
        map[file._id.toString()] = {
            ...file.toObject(),
            children: []
        }
    })

    // Second pass: attach each node to its parent, or to the root
    files.forEach(file => {
        const id = file._id.toString()
        const node = map[id]

        if (file.parentId) {
            const parent = map[file.parentId.toString()]
            if (parent) {
                parent.children.push(node)
            } else {
                // parent missing (e.g. soft-deleted), so treat as root
                tree.push(node)
            }
        } else {
            tree.push(node)
        }
    })

    console.log('map', map)
    console.log('tree', tree)

    return tree
}