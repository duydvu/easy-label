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

    def get_database(self):
        return self.databaseName

    def get_collection(self):
        return self.collectionName

    def get_metadata(self):
        collectionCount = self.collection.count()
        print(collectionCount)
        keys = list(self.collection.find_one().keys())
        return {
            'count': collectionCount,
            'keys': keys
        }

    def find_by_index(self, index):
        return self.collection.find_one({'index': index})

    def insert_from_JSON_file(self, filename):
        try:
            dataset = json.load(open(filename))
        except:
            print('Error while reading file %s' % filename)
        for index, document in enumerate(dataset):
            document['index'] = index
        self.collection.insert_many(dataset)

    def insert(self, document):
        self.collection.insert_one(document)

    def update_by_index(self, index, document):
        try:
            self.collection.find_one_and_update({ 'index': index }, {'$set': document})
            return True
        except Exception as e:
            print(e)
            return False
