'use strict';
module.exports = {
    "extends": './.eslintrc.json',
    "rules": {
        // override default options
       'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix']
    }
};
