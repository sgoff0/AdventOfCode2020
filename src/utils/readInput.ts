import path from 'path';
import { readFileSync } from 'fs';
import getCallerFile from 'get-caller-file';

export default function () {
  const file = path.join(path.dirname(getCallerFile()), 'input.txt');
  // const file = path.join(path.dirname(getCallerFile()), 'demoInput.txt');
  return readFileSync(file).toString();
}
