from pymongo import MongoClient
import pymongo
import json
import datetime

def get_logs_collection(collectionName):
    return collectionName + '_logs'

class DatasetManager:
    def __init__(self, host='localhost', database='easy-label'):
        self.host = host
        self.databaseName = database
        self.client = MongoClient(self.host, 27017)
        self.database = self.client[database]

    def get_database(self):
        return self.databaseName

    def get_all_collections(self):
        return self.database.collection_names()

    def get_metadata(self, collectionName='dataset'):
        collection = self.database[collectionName]
        logsCollection = self.database[get_logs_collection(collectionName)]
        collectionCount = collection.count()
        keys = list(collection.find_one().keys())
        return {
            'count': collectionCount,
            'keys': keys,
            'collection': collectionName,
            'all_collections': self.get_all_collections(),
            'logs': logsCollection.find().sort('date',  direction=pymongo.DESCENDING).limit(50)
        }

    def find_by_index(self, index, collectionName='dataset'):
        return self.database[collectionName].find_one({'index': index})

    def insert_from_data(self, data, collectionName='dataset'):
        self.database.drop_collection(collectionName)
        self.database.drop_collection(get_logs_collection(collectionName))
        dataset = json.loads(data)
        if not isinstance(dataset, list):
            return False
        self.database[collectionName].create_index('index', unique=True)
        for index, document in enumerate(dataset):
            document['index'] = index
        return self.database[collectionName].insert_many(dataset)

    def update_by_index(self, index, document, collectionName='dataset'):
        try:
            self.database[collectionName].find_one_and_update(
                {'index': index}, {'$set': document})
            # Add log
            log = {
                'action': 'UPDATE_DATA',
                'index': index,
                'detail': document,
                'date': datetime.datetime.utcnow()
            }
            self.database[get_logs_collection(collectionName)].insert_one(log)
            return log
        except Exception as e:
            print(e)
            return False

    def get_labelled_data(self, labels, collectionName='dataset'):
        query_object = {}
        for label in labels:
            if label['type'] == 'boolean':
                query_object[label['name']] = {
                    '$in': [True, False]
                }
        labelled_documents = list(self.database[collectionName].find(query_object, {'_id': 0}))
        return json.dumps(labelled_documents, ensure_ascii=False)
