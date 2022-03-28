class QueryUtil {
    
    /**
     * Give pg client to constructor
     */
    constructor(client) {
        //Save client to local class
        this.client = client
    }

    /**
     * Returns a proper string that can be used in the query string
     */
    HandleArgs(args) {
        let temp = ''
        for (var i = 0; i < args.length; i++) {
            temp += i < args.length - 1 ? `${args[i]},` : args[i]
        }
        return temp
    }

    /**
     * Get any properties from any table, tableName is the variable holding the name of the table
     * args contains all the wanted properties.
     * 
     * If id is null, then the query will not add a `where id is` statement
     */
    async GetSelectProps (tableName, id = null, ...args) {
        const properties = this.HandleArgs(args)
        const idStatement = id !== null && id !== undefined ? `WHERE id = ${id}`: ''

        const res = await this.client.query(`SELECT ${properties} FROM ${tableName} ${idStatement}`)

        return res.rows
    }
}

module.exports = QueryUtil