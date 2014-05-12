'use strict';

angular.module('saddlApiApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
