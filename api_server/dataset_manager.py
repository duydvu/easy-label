from pymongo import MongoClient
import json

class DatasetManager:
    def __init__(self, host='localhost', database='easy-label', collection='dataset'):
        self.host = host
        self.databaseName = database
        self.collectionName = collection
        self.client = MongoClient(self.host, 27017)
        self.database = self.client[database]
        self.collection = self.database[collection]

    def getDatabase(self):
        return self.databaseName

    def getCollection(self):
        return self.collectionName

    def getMetadata(self):
        collectionCount = self.collection.count()
        print(collectionCount)
        keys = list(self.collection.find_one().keys())
        return {
            'count': collectionCount,
            'keys': keys
        }

    def findByIndex(self, index):
        return self.collection.find_one({'index': index})

    def insertFromJSONFile(self, filename):
        try:
            dataset = json.load(open(filename))
        except:
            print('Error while reading file %s' % filename)
        for index, document in enumerate(dataset):
            document['index'] = index
        self.collection.insert_many(dataset)

    def insert(self, document):
        self.collection.insert_one(document)

    def updateByIndex(self, index, document):
        self.collection.find_one_and_replace({ 'index': index }, document)
