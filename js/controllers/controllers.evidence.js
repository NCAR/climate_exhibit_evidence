(function () {
    'use strict';
    angular.module('edu.ucar.scied.controllers.evidence', [])
        .controller('homeCtrl', homeCtrl)
        .controller('videosCtrl', videosCtrl)
        .controller('playerCtrl', playerCtrl);

    function homeCtrl($rootScope, $scope) {
        $rootScope.showFooter = false;
        $rootScope.bodylayout = 'home';
        $rootScope.menulist = 'home';
        $scope.cols = 3;
        $scope.data = 'data/menu_main.json';
    }

    function videosCtrl($rootScope, $scope, ContentData) {
        $rootScope.showFooter = true;
        $rootScope.bodylayout = 'videos';
        $rootScope.menulist = 'videos';
        $scope.pagetitle = "Videos";
        $scope.header_class = "larger";
        $scope.cols = 3;
        $scope.data = 'data/menu_main.json';
    }

    function playerCtrl($rootScope, $scope) {
        $rootScope.showFooter = true;
        $rootScope.bodylayout = 'video-player';
        $scope.backButton = true;
        $scope.backButtonText = "Videos";
        $scope.backPage = "#/videos";
    };
})();