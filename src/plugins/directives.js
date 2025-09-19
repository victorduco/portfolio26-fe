import { hoverDistortion } from '../directives/index.js';

export default {
  install(app) {
    app.directive('hover-distortion', hoverDistortion);
  }
};