import yaml


class ConfigParser:
    config_file = './configs.yml'

    def __init__(self):
        with open(self.config_file, 'r') as stream:
            self.config = yaml.load(stream)
    
    def validate(self):
        config = self.config
        return ('data_file' in config) and ('type' in config)

    def get_data_file(self):
        return self.config['data_file']

    def get_labels(self):
        labels = self.config['labels']
        nameList = [list(label.keys())[0] for label in labels]
        typeList = [label[name] for label, name in zip(labels, nameList)]
        return list(map(lambda x: {
            'name': x[0],
            'type': x[1]
        }, zip(nameList, typeList)))
