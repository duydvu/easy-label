#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const program = require('commander');
const { APP } = require('../../config');

program
    .version('0.0.2', '-v, --version')
    .arguments('<dir> <name>')
    .option('-c, --class', 'Class component')
    .action((directory, component, cmd) => {
        const componentDirectory = path.join(__dirname, `../../src/client/${APP}/components`, directory, component);

        const indexJSContent = `export { default } from './${component}';
`;
        const componentContent = `import React from 'react';
import './${component}.scss';

${cmd.class ? `export default class ${component} extends React.Component {
    //
}
` : `export default function ${component}(props) {
    //
}
`}`;

        const testContent = `
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

        const scssContent = `@import '../../../scss/global.scss';
`;

        const dirPath = path.join(__dirname, `../../src/client/${APP}/components`, directory);
        if (!fs.existsSync(dirPath)) {
            console.log(`Directory ${dirPath} does not exist.`);
            process.exit(1);
        }

        if (fs.existsSync(componentDirectory)) {
            console.log('Component already exists.');
            process.exit(1);
        }

        fs.mkdirSync(componentDirectory);
        fs.writeFileSync(path.join(componentDirectory, 'index.js'), indexJSContent);
        fs.writeFileSync(path.join(componentDirectory, `${component}.jsx`), componentContent);
        fs.writeFileSync(path.join(componentDirectory, `${component}.test.js`), testContent);
        fs.writeFileSync(path.join(componentDirectory, `${component}.scss`), scssContent);
    });

program.parse(process.argv);
