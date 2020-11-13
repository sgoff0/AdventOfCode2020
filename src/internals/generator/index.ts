import {NodePlopAPI} from 'plop';

import adventOfCode from './aoc';

export default function (plop: NodePlopAPI) {
    plop.setGenerator('aoc', adventOfCode);
};
