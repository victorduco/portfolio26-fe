import { hoverDistortion, maskElement } from '../directives/index.js';
import { backdropFilter } from '../directives/backdrop-filter';

export default {
  install(app) {
    app.directive('hover-distortion', hoverDistortion);
    app.directive('mask-element', maskElement);
    app.directive('backdrop-filter', backdropFilter);
  }
};