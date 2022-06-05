class CachingCollection {

    constructor(database, collectionName) {
        this.db = database.collection(collectionName);
        this.cache = new Collection()
    }

    inCache(query) {
        return this.cache.has(query);
    }

    getFromCache(query) {
        return this.cache.get(query);
    }

    async getFromDatabase(query) {
        return await this.db.findOne(query);
    }

    async findOne(query) {
        if(this.inCache(query)) {
            return this.getFromCache(query);
        } else {
            const data = await this.getFromDatabase(query);
            this.cache.set(query, data)
            return data
        }
    }

    async find(query) {
        return await this.db.find(query) // Can't use Cache for this one :(
    }

    async findMany(query) {
        return await this.db.findMany(query)
    }

    async updateOne(query, update, options) {
        options = options || {};
        options.returnDocument = "after";
        const data = await this.db.findOneAndUpdate(query, update, options);
        this.cache.set(query, data);
    }

    async deleteOne(query) {
        const data = await this.db.deleteOne(query)
        if(data.deletedCount > 0) {
            this.cache.delete(query)
        }
        return data
    }

    async deleteMany(query) {
        const data = await this.db.deleteMany(query)
        if(data.deletedCount > 0) {
            this.cache.delete(query)
        }
        return data
    }

    async insertOne(document) {
        await this.db.insertOne(document)
        // You can't exactly add a document to the cache as I map it by query, and I can't guess what I'm doing.
    }
    
    async insertMany(documents) {
        await this.db.insertMany(documents)
    }
}
