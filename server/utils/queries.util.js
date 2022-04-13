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
    HandleArgs(args, seperator) {
        let temp = ''
        for (var i = 0; i < args.length; i++) {
            temp += i < args.length - 1 ? `${args[i]}${seperator}` : args[i]
        }
        return temp
    }

    CheckStatements(dict) {
        let temp = []
        Object.keys(dict).forEach((v, i) => {
            if(dict[v]) {
                if(dict[v].includes("'")) {
                    dict[v] = dict[v].slice(0, dict[v].indexOf("'") - 1) + "\\" +  dict[v].slice(dict[v].indexOf("'"))
                    console.log(dict[v])
                }
            }
            temp.push(`${v}='${dict[v]}'`)
        })
        console.log(temp)
        return temp
    }

    /**
     * Get any properties from any table, tableName is the variable holding the name of the table
     * props contains all the wanted properties.
     * 
     * wStatements contains all the where statements provided
     * 
     * In javascript it is not possiblie to add star operators to parameters.
     * To simulate this effect props is an array and wStatements is a dictionary.
     * The dictionary will be used to create a useable string for the query
     */
    async GetSelectProps (tableName, props = [], wStatements = {}) {
        const properties = this.HandleArgs(props, ',')
        // console.log(this.CheckStatements(wStatements))
        //The full where statement
        const where = Object.keys(wStatements).length !== 0 ? `WHERE ${this.HandleArgs(this.CheckStatements(wStatements), ' AND ')}` : ''
        console.log(`SELECT ${properties} FROM ${tableName} ${where}`)
        const res = await this.client.query(`SELECT ${properties} FROM ${tableName} ${where}`)

        return res.rows
    }
}

module.exports = {
    QueryUtil
}