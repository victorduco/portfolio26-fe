import { hoverDistortion, maskElement } from '../directives/index.js';

export default {
  install(app) {
    app.directive('hover-distortion', hoverDistortion);
    app.directive('mask-element', maskElement);
  }
};