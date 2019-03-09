/**
 * index.js file content
 * @param {string} component - Component name
 */
const indexJSContent = component => `export { default } from './${component}';`;

/**
 * Component file content, can be function or class
 * @param {string} component - Component name
 * @param {boolean} cls - Indicate a class component
 */
const componentContent = (component, cls) => `import React from 'react';

export default ${cls ? `class ${component} extends React.Component {
    //
}` : `function ${component}(props) {
    //
}`}
`;

/**
 * Component test file content
 * @param {*} component - Component name
 */
const testContent = component => `
import React from 'react';
import { shallow } from 'enzyme';

import ${component} from './${component}';

describe('${component}', () => {
    const wrapper = shallow(<${component} />);

    it('', () => {
        //
    });
});
`;

module.exports = {
    indexJSContent,
    componentContent,
    testContent,
};
