'use strict';

import angular from 'angular';
import LoginController from './login.controller';

export default angular.module('demo3App.login', [])
  .controller('LoginController', LoginController)
  .name;
