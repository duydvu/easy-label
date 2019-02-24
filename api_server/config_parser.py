import yaml


class ConfigParser:
    config_file = './configs.yml'

    def __init__(self):
        with open(self.config_file, 'r') as stream:
            self.config = yaml.load(stream)

    def get_config(self):
        return self.config