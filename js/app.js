/* global moment */
/* global angular */
var app = angular.module('StarterApp', ['ngMaterial', 'googlechart', 'ngMdIcons', 'angularMoment', 'ngStorage']);

app.run(function(amMoment) {
  amMoment.changeLocale('sv');
});

app.controller('AppCtrl', function($scope, $http, $q, $mdSidenav, $localStorage) {
  console.log('loaded main controller');

  // Vars
  $scope.$storage = $localStorage;
  $scope.costs = 0;
  $scope.salary = 0;
  $scope.selected = {
    'month': moment().format('MMMM'),
    // 'month': 'September',
    'year': moment().format('YYYY')
  };
  $scope.initializing = true;
  $scope.datasetSalary = [];
  $scope.datasetCosts = [];
  $scope.monthsAvailable = [];
  $scope.yearsAvailable = [];
  $scope.plusminus = 0;
  $scope.plusminusSign = '';
  $scope.newCost = {
    'amount': null,
    'category': null,
    'date': null,
    'by': null
  };
  $scope.newSalary = {
    'type': null,
    'value': null,
    'by': null
  };

  $scope.categories = [
    'Räkningar', 'Övrigt', 'Bilkostnader', 'Kläder'
  ];
  
  $scope.saveCost = function() {
    $scope.newCost.date = moment().format('YYYY-MM-DD')
    $scope.newCost.by = $scope.$storage.username;
    $scope.datasetCosts.push($scope.newCost);
    console.log(JSON.stringify($scope.newCost));
    $scope.newCost = {
      'category':null,
      'amount':null,
      'date':null,
      'by':$scope.$storage.username
    };
    $scope.sumItUp();
    // DO POSTING HERE TO API
  };

  $scope.saveSalary = function() {
    $scope.newSalary.date = moment().format('YYYY-MM-DD')
    $scope.datasetSalary.push($scope.newSalary);
    console.log(JSON.stringify($scope.newSalary));
    $scope.newSalary = {
      'type': null,
      'value': null,
      'by': null
    };
    $scope.sumItUp();
    // DO POSTING HERE TO API
  };

  $scope.clearCost = function() {
    $scope.newCost = {
      'category':null,
      'amount':null,
      'date':null,
      'by':$scope.$storage.username
    };
  };
  
  $scope.clearSalary = function() {
    $scope.newSalary = {
      'type': null,
      'value': null,
      'by': null
    };
  };

  $scope.loadCategories = function() {
  };

  // Alaways load the main layout file, application start point
  $scope.nav = 'partials/main.html';

  // Menu item selection and loading of partials to content area
  $scope.doNav = function(partial) {
    switch (partial) {
      case null:
        $scope.nav = 'partials/main.html';
        $mdSidenav('left').toggle();
        break;
      case 'overview':
        $scope.nav = 'partials/main.html';
        $mdSidenav('left').toggle();
        break;
      case 'settings':
        $scope.nav = 'partials/settings.html';
        $mdSidenav('left').toggle();
        break;
      case 'addsalary':
        $scope.nav = 'partials/addsalary.html';
        $mdSidenav('left').toggle();
        break;
      case 'addcost':
        $scope.nav = 'partials/addcost.html';
        $mdSidenav('left').toggle();
        break;
      case 'graph':
        $scope.nav = 'partials/graph.html';
        $mdSidenav('left').toggle();
        break;
      case 'details':
        $scope.nav = 'partials/details.html';
        $mdSidenav('left').toggle();
        break;
      case 'details-view':
        $scope.nav = 'partials/details.html';
        break;
      default:
        $scope.nav = 'partials/main.html';
        $mdSidenav('left').toggle();
        break;
    }

  };
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.dummy = function() {};

  $scope.$watch('selected.year', function(newValue, oldValue) {
    if (newValue != oldValue) {
      $scope.selected.month = '';
      console.log('year changed ' + $scope.selected.year);
      $scope.fetchData();
    }
  });

  // Calculations
  $scope.calculations = function() {
    var nullIt = function() {
      console.log('Nulling values');
      // Reset the needed values so that we do not add on to them
      $scope.yearsAvailable = [];
      $scope.monthsAvailable = [];
      $scope.datasetSalary = [];
      $scope.datasetCosts = [];
    };

    var sortThrough = function() {
      console.log('Running sort for ' + $scope.selected.year + ' / ' + $scope.selected.month);
      // SALARY
      // From salary, extract the current year and corresponding months data
      angular.forEach($scope.salary, function(stage1, index) {
        // Add Year to avail years
        $scope.yearsAvailable.push(stage1.year);
        // Add the selected year to the current dataset
        if (stage1.year == $scope.selected.year) {
          angular.forEach(stage1.months, function(stage3, index) {
            $scope.monthsAvailable.push(stage3.month);
            if (angular.lowercase(stage3.month) == angular.lowercase($scope.selected.month)) {
              // Add to dataset
              $scope.datasetSalary = stage3.data;
              // console.log('DatasetSalary + ' + JSON.stringify(stage3.data));
            }
          });
        }
      });

      // COSTS
      angular.forEach($scope.costs, function(stage1, index) {
        if (stage1.year == $scope.selected.year) {
          angular.forEach(stage1.months, function(stage3, index) {
            if (angular.lowercase(stage3.month) == angular.lowercase($scope.selected.month)) {
              // Add to dataset
              $scope.datasetCosts = stage3.data;
              // console.log('DatasetCosts + ' + JSON.stringify(stage3.data));
            }
          });
        }
      });
    };
    sortThrough(function() {
    },nullIt());
  };

  $scope.sumItUp = function() {
    // Reset total values
    $scope.totalSalarySelectedMonth = 0;
    $scope.totalCostSelectedMonth = 0;
    // SUM UP
    console.log('summing up');
    angular.forEach($scope.datasetSalary,function(x, index) {
      $scope.totalSalarySelectedMonth += x.value;
    });
    
    angular.forEach($scope.datasetCosts,function(y, index) {
      $scope.totalCostSelectedMonth += y.amount;
    });

    $scope.plusminus = $scope.totalSalarySelectedMonth - $scope.totalCostSelectedMonth;
    if ($scope.totalSalarySelectedMonth > $scope.totalCostSelectedMonth) {
      $scope.plusminusSign = '+';
    }
    else {
      $scope.plusminusSign = '';
    }
  };

  $scope.fetchData = function() {
    console.log('fetching data');
    $scope.totalCostSelectedMonth = 0;
    $scope.totalSalarySelectedMonth = 0;

    $http.get('js/mockdata/costs.json').then(function(result) {
      // console.log('costs get run');
      $scope.costs = result.data;
      $http.get('js/mockdata/salary.json').then(function(result) {
        // console.log('salary get run');
        $scope.salary = result.data;
        
        $scope.sumItUp(function() {
        },$scope.calculations());
      });
    });
  };
  $scope.fetchData();
});

app.controller('charts', function ($scope) {
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
