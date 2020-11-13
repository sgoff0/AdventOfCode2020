import '../../utils/env';
import { NodePlopAPI } from 'plop';

import adventOfCode from './aoc';

import axios from 'axios';

export default function (plop: NodePlopAPI) {
  plop.setActionType('fetchUrlData', async function (answers: any, config, plop) {
    // console.log('URL: ', answers);
    try {
      const response = await axios.get(answers.url, {
        headers: {
          cookie: `session=${process.env.session}`,
        },
      });
      //   console.log('Response: ', response);
      answers.responseBody = response.data;
    } catch (e) {
      // Please login error currently
      answers.responseBody = 'error';
      console.error(e);
    }
    // config.responseBody = 123456789;
    // plop.responseBody = 123456789;
    return 'good url';
  });
  plop.setHelper('upperCase2', async (txt) => txt.toUpperCase());
  plop.setGenerator('aoc', adventOfCode);
}
