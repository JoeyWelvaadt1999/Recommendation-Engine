const { QueryUtil } = require('../utils/queries.util')
class Recommendation {
    constructor(client) {
        this.util = new QueryUtil(client)
    }    


    /**
     * This functions checks whether the price is in range of the start price
     * @param {Array of items that need to be checked} arr 
     * @param {The initial price that will be used to check the array} price 
     * @param {The range in percentage will be used as threshold} range 
     */
    CheckPriceRange(arr, price, range) {
        console.log('price' + price)
        const percentage = price / 100 * range
        let temp = []
        for (let i = 0; i < arr.length; i++) {
            if(arr[i]['sellingprice'] < price - percentage || arr[i]['sellingprice'] > price + percentage) {
                i++
                continue;
            }
            temp.push(arr[i])
        }
        return temp
    }

    async GetContentRecommendation(tableName, item, total) {
        const priceFilter = await this.util.GetSelectProps(tableName, ['id','sellingprice', 'category'], {"category": item['category']})

        const brandOpt = {}
        if(item['brand'] !== null) {
            brandOpt['brand'] = item['brand']
        }
        if(item['targetaudience'] !== null || item['brand'] === null) {
            brandOpt['targetaudience'] = item['targetaudience']
        }

        const brandFilter = await this.util.GetSelectProps(tableName, ['id','brand', 'targetaudience'], {"brand": item['brand'], "targetaudience": item['targetaudience']})
        const newPriceFilter = this.CheckPriceRange(priceFilter, item['sellingprice'], 20)

        const allItems = newPriceFilter.concat(brandFilter)
        const randNumbers = []

        const recommendations = []
        if(allItems.length > 0) {
            for(let i = 0; i < total; i++) {
                const rand = Math.floor(Math.random() * allItems.length)
                randNumbers.push(rand)

                const recommendation = await this.util.GetSelectProps(tableName, ['*'], {"id": allItems[rand].id})

                recommendations.push(recommendation[0])
            }
            return recommendations
        }
        return;
    }

    GetCollaborationRecommendation(id) {

    }
}

module.exports = {
    Recommendation
}
