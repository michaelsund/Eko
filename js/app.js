var app = angular.module('StarterApp', ['ngMaterial', 'googlechart', 'ngMdIcons']);

app.controller('AppCtrl', ['$scope', '$http', '$mdSidenav', function($scope, $http, $mdSidenav) {
  console.log('loaded main controller');
  // Alaways load the main layout file, application start point
  $scope.nav = 'partials/main.html';

  // Menu item selection and loading of partials to content area
  $scope.doNav = function(partial) {
    switch (partial) {
      case null:
        $scope.nav = 'partials/main.html';
        break;
      case 'overview':
        $scope.nav = 'partials/main.html';
        break;
      case 'add':
        $scope.nav = 'partials/add.html';
        break;
      case 'graph':
        $scope.nav = 'partials/graph.html';
        break;
      case 'details':
        $scope.nav = 'partials/details.html';
        break;
      default:
        $scope.nav = 'partials/main.html';
    }

    // Close the sidenav when a selection is made, only affects small devices
    $mdSidenav('left').toggle();
  };
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.fetchData = function() {
    console.log('fetching data');
    // Mock data
    $scope.salarysThisMonth = [
      20000,
      10000
    ];

    $scope.thisMonth = [
      {
        'category':'Räkningar',
        'amount':7000,
        'date':'2015-01-01'
      },
      {
        'category':'Mat',
        'amount':2000,
        'date':'2015-01-02'
      }
    ];

    // Calculations
    $scope.totalSalaryThisMonth = 0;
    for (x in $scope.salarysThisMonth) {
      $scope.totalSalaryThisMonth += $scope.salarysThisMonth[x];
    }
  };
  $scope.fetchData();
}]);

angular.module('StarterApp')
.controller('charts', function ($scope) {
  $scope.chartObject = {};
  $scope.chartObject.type = 'AreaChart';
  $scope.onions = [
      {v: 'Onions'},
      {v: 3},
  ];
  $scope.chartObject.data = {'cols': [
      {id: 't', label: 'Topping', type: 'string'},
      {id: 's', label: 'Slices', type: 'number'}
  ], 'rows': [
      {c: [
          {v: 'Mushrooms'},
          {v: 3},
      ]},
      {c: $scope.onions},
      {c: [
          {v: 'Olives'},
          {v: 31}
      ]},
      {c: [
          {v: 'Zucchini'},
          {v: 1},
      ]},
      {c: [
          {v: 'Pepperoni'},
          {v: 2},
      ]}
  ]};
});
