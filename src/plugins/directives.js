import { hoverDistortion, maskElement } from '../directives/index.js';
import { backdropFilter } from '../directives/backdrop-filter';

export default {
  install: (app) => Object.entries({ 'hover-distortion': hoverDistortion, 'mask-element': maskElement, 'backdrop-filter': backdropFilter }).forEach(([name, directive]) => app.directive(name, directive))
};
