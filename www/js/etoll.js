
angular.module('eTollTask1', ['ionic'])

    .controller('TodoCtrl', function($scope) {
        $scope.tasks = [
            { title: 'Collect coins' },
            { title: 'Eat mushrooms' },
            { title: 'Get high enough to grab the flag' },
            { title: 'Find the Princess' }
        ];
    });