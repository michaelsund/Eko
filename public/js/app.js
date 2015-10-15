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
    'year': moment().format('YYYY'),
    'date': new Date()
  };
  $scope.initializing = true;
  $scope.datasetSalary = [];
  $scope.datasetCosts = [];
  $scope.monthsAvailable = [];
  $scope.yearsAvailable = [];
  $scope.plusminus = 0;
  $scope.plusminusSign = '';
  $scope.newCost = {
    'year': moment($scope.selected.date).format('YYYY'),
    'month': moment($scope.selected.date).format('MMMM'),
    'date': $scope.selected.date,
    'amount': null,
    'category': null,
    'by': null
  };
  $scope.newSalary = {
    'category': null,
    'value': null,
    'by': null
  };

  $scope.categories = [
    'Räkningar', 'Övrigt', 'Bilkostnader', 'Kläder'
  ];
  
  $scope.saveCost = function() {
    $scope.newCost.year = moment($scope.selected.date).format('YYYY');
    $scope.newCost.month = moment($scope.selected.date).format('MMMM');
    $scope.newCost.date = $scope.selected.date;
    $scope.newCost.by = $scope.$storage.username;
    $http.put('api/cost', $scope.newCost).then(function(result) {
      console.log(result);
      $scope.sumItUp();
      $scope.newCost = {
        'year': null,
        'month': null,
        'date': $scope.selected.date,
        'category': null,
        'amount': null,
        'by':$scope.$storage.username
      };
      $scope.fetchData();
    });
  };

  $scope.saveSalary = function() {
    $scope.newSalary.date = moment().format('YYYY-MM-DD')
    $scope.datasetSalary.push($scope.newSalary);
    $scope.newSalary = {
      'year': null,
      'month': null,
      'date': null,
      'category': null,
      'value': null,
      'by': null
    };
    $scope.sumItUp();
  };

  $scope.clearCost = function() {
    $scope.newCost = {
      'category':null,
      'amount':null,
      'by':$scope.$storage.username
    };
  };
  
  $scope.clearSalary = function() {
    $scope.newSalary = {
      'category': null,
      'value': null,
      'by':$scope.$storage.username
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
      $scope.sortData();
      $scope.nullAll();
    }
  });
  
  $scope.nullAll = function() {
    $scope.datasetCosts = [];
    $scope.datasetSalary = [];
    $scope.plusminus = 0;
    $scope.plusminusSign = '';
    $scope.totalCostSelectedMonth = 0;
    $scope.totalSalarySelectedMonth = 0;
  };
  
  $scope.updateDataset = function(month) {
    $scope.selected.month = month;
    $scope.sumItUp(function () {
      
    },$scope.pickDataset());
  };
  
  $scope.resetDate = function() {
    $scope.selected.date = new Date();
  };

  $scope.sortData = function() {
    $scope.yearsAvailable = [];
    $scope.monthsAvailable = [];
    // picking out available years and months, based on selceted year
    angular.forEach($scope.salary, function(value, key) {
      // Pick out each year
      if ($scope.yearsAvailable.indexOf($scope.salary[key].year) < 0) {
        $scope.yearsAvailable.push($scope.salary[key].year);
      }
      // Pick out each month for current year
      if ($scope.salary[key].year == $scope.selected.year) {
        if ($scope.monthsAvailable.indexOf($scope.salary[key].month) < 0) {
          $scope.monthsAvailable.push($scope.salary[key].month);
        }
      }
    });
  };
  
  $scope.pickDataset = function() {
    // reset datasets
    $scope.datasetCosts = [];
    $scope.datasetSalary = [];
    // pick salary dataset
    angular.forEach($scope.salary, function(value, key) {
      if ($scope.salary[key].year == $scope.selected.year && angular.lowercase($scope.salary[key].month) === angular.lowercase($scope.selected.month)) {
        $scope.datasetSalary.push($scope.salary[key]);
      }
    });
    angular.forEach($scope.costs, function(value, key) {
      if ($scope.costs[key].year == $scope.selected.year && angular.lowercase($scope.costs[key].month) === angular.lowercase($scope.selected.month)) {
        $scope.datasetCosts.push($scope.costs[key]);
      }
    });
  };
  
  $scope.sumItUp = function() {
    // reset calculations
    $scope.totalCostSelectedMonth = 0;
    $scope.totalSalarySelectedMonth = 0;
    angular.forEach($scope.datasetSalary, function(value, key) {
      $scope.totalSalarySelectedMonth += $scope.datasetSalary[key].value;
    });
    angular.forEach($scope.datasetCosts, function(value, key) {
      $scope.totalCostSelectedMonth += $scope.datasetCosts[key].amount;
    });
    $scope.plusminus = $scope.totalSalarySelectedMonth - $scope.totalCostSelectedMonth;
    if ($scope.plusminus < 0) {
      $scope.plusminusSign = '';
    }
    else {
      $scope.plusminusSign = '+';
    }
  };
  
  $scope.fetchData = function() {
    $scope.totalCostSelectedMonth = 0;
    $scope.totalSalarySelectedMonth = 0;

    $http.get('api/cost').then(function(result) {
      $scope.costs = result.data;
      $http.get('api/salary').then(function(result) {
        $scope.salary = result.data;
        $scope.pickDataset(function() {
        },$scope.sortData());
        $scope.sumItUp();
      });
    });
  };
  $scope.fetchData();
});

app.controller('charts', function ($scope) {
  $scope.chartObject = {};
  $scope.chartObject.category = 'AreaChart';
  $scope.onions = [
      {v: 'Onions'},
      {v: 3},
  ];
  $scope.chartObject.data = {'cols': [
      {id: 't', label: 'Topping', category: 'string'},
      {id: 's', label: 'Slices', category: 'number'}
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
