const _addAll = async (client, data) => {
    try {
        await client.db("Y2Proj").collection("alldata").insertOne(data);
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
}

const _addNew = async (client, data) => {
    try {
        await client.db("Y2Proj").collection("newdata").insertOne(data);
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
}

const updateAll = async (client, data) => {
    try {        
        await client.db("Y2Proj").collection("alldata").deleteMany({});
        await _addAll(client, data);
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
}

const updateNew = async (client, data) => {
    try {        
        await client.db("Y2Proj").collection("newdata").deleteMany({});
        await _addNew(client, data);
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
}

const readAll = async (client) => {
    const result = await client.db("Y2Proj").collection("alldata").findOne({});
    return result;
}

const readNew = async (client) => {
    const result = await client.db("Y2Proj").collection("newdata").findOne({});
    return result;
}

module.exports = {
    _addAll, _addNew,
    updateAll, updateNew,
    readAll, readNew
}