import renderer from './renderer';

const index = (req, res) => {
    renderer(req, res, 'index', 'Home Page');
};

export {
    index,
};
