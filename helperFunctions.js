module.exports.checkSearch = (search) => {
    let query = {}
    if (search) {
        query = {$text: {$search: search}}
    }
    return query
}