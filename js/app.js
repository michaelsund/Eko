var app = angular.module('StarterApp', ['ngMaterial', 'googlechart', 'ngMdIcons']);

app.controller('AppCtrl', ['$scope', '$http', '$mdSidenav', function($scope, $http, $mdSidenav) {
  // Alaways load the main layout file, application start point
  $scope.nav = 'partials/main.html';
  // Mock data, for last 3 months
  $scope.data = [
    {
      month: 'Janurai',
      amount: 100,
      category: 'övrigt'
    },
    {
      month: 'Februari',
      amount: 200,
      category: 'mat'
    },
    {
      month: 'Februari',
      amount: 100,
      category: 'mat'
    },
    {
      month: 'Mars',
      amount: 400,
      category: 'räkningar'
    },
    {
      month: 'Mars',
      amount: 300,
      category: 'räkningar'
    }
  ];

  $scope.initialFetch = function() {
    $scope.totalThisMonth = 0;
    for (x in $scope.data) {
      // will change, set current month before check in loop
      if ($scope.data[x].month === 'Mars') {
        $scope.totalThisMonth += $scope.data[x].amount;
        console.log('adding ' + $scope.data[x].amount);
      }
    }
  };
  $scope.initialFetch();
  // Menu item selection and loading of partials to content area
  $scope.doNav = function(partial) {
    switch (partial) {
      case null:
        $scope.nav = 'partials/main.html';
        break;
      case 'overview':
        $scope.nav = 'partials/main.html';
        break;
      case 'write':
        $scope.nav = 'partials/new.html';
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

}]);

angular.module('StarterApp')
.controller('charts', function ($scope) {
  $scope.chartObject = {};
  $scope.chartObject.type = "AreaChart";
  $scope.onions = [
      {v: "Onions"},
      {v: 3},
  ];
  $scope.chartObject.data = {"cols": [
      {id: "t", label: "Topping", type: "string"},
      {id: "s", label: "Slices", type: "number"}
  ], "rows": [
      {c: [
          {v: "Mushrooms"},
          {v: 3},
      ]},
      {c: $scope.onions},
      {c: [
          {v: "Olives"},
          {v: 31}
      ]},
      {c: [
          {v: "Zucchini"},
          {v: 1},
      ]},
      {c: [
          {v: "Pepperoni"},
          {v: 2},
      ]}
  ]};

  $scope.chartObject.options = {
      'title': 'How Much Pizza I Ate Last Night'
  };
});
