from pymongo import MongoClient
from bson.json_util import dumps
import json
from io import StringIO

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

    def get_labelled_data(self, labels):
        query_object = {}
        for label in labels:
            if label['type'] == 'boolean':
                query_object[label['name']] = {
                    '$in': [True, False]
                }
        labelled_documents = list(self.collection.find(query_object, { '_id': 0 }))
        strIO = StringIO(json.dumps(labelled_documents, ensure_ascii=False))
        return strIO
