var app = angular.module('StarterApp', ['ngMaterial', 'googlechart', 'ngMdIcons', 'angularMoment']);

app.run(function(amMoment) {
  amMoment.changeLocale('sv');
});

app.controller('AppCtrl', function($scope, $http, $q, $mdSidenav) {
  console.log('loaded main controller');
  var salaryPromise = $q.defer();
  var costsPromise = $q.defer();
  var calculationsPromise = $q.defer();

  // Vars
  $scope.costs = 0;
  $scope.salary = 0;
  $scope.selected = {
    'month': new moment().format('MMMM'),
    // 'month': 'September',
    'year': new moment().format('YYYY')
  };
  $scope.initializing = true;
  $scope.datasetSalary = [];
  $scope.datasetCosts = [];
  $scope.monthsAvailable = [];
  $scope.yearsAvailable = [];
  $scope.plusminus = 0;
  $scope.plusminusSign = '';
  $scope.newCost = {
    'cost': null,
    'category': null
  };
  $scope.newMoney = {
    'amount': null,
    'desc': null
  };

  $scope.categories = [
    'Räkningar', 'Övrigt', 'Bilkostnader', 'Kläder'
  ];

  $scope.saveCost = function() {
    // console.log('saving ' + $scope.newCost.cost + ' at ' + $scope.newCost.category);
  };

  $scope.saveNewMoney = function() {
    console.log('saving ' + $scope.newMoney.amount + ' at ' + $scope.newMoney.desc);
    $scope.newMoney.amount = null;
    $scope.newMoney.desc = null;
  };

  $scope.clearCost = function() {
    // $scope.newCost.cost = null;
    // $scope.newCost.category = null;
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
      case 'addmoney':
        $scope.nav = 'partials/addmoney.html';
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
      $scope.loadMonthsAvailable();
    }
  });


  $scope.loadMonthsAvailable = function() {
    console.log('loading months');
    $scope.monthsAvailable = [];
    for (x in $scope.datasetCosts) {
      $scope.monthsAvailable.push($scope.datasetCosts[x].month);
    }
  };

  $scope.showdata = function() {
    console.log('COSTS: ' + JSON.stringify($scope.datasetCosts));
    console.log('SALARY: ' + JSON.stringify($scope.datasetSalary));
  };

  // Calculations
  $scope.calculations = function() {
    $scope.totalSalarySelectedMonth = 0;
    $scope.totalCostSelectedMonth = 0;
    console.log($scope.selected.year);
    $scope.yearsAvailable = [];
    $scope.datasetSalary = [];
    $scope.datasetCosts = [];
    console.log('running calculations');
    console.log($scope.salary);
    for (x in $scope.salary) {
      $scope.yearsAvailable.push($scope.salary[x].year);
      // Use the current year as dataset, filter month later when picked in dropdown
      if ($scope.salary[x].year == $scope.selected.year) {
        $scope.datasetSalary = $scope.salary[x].months;
      }
    }
    for (x in $scope.costs) {
      // Use the current year as dataset, filter month later when picked in dropdown
      if ($scope.costs[x].year == $scope.selected.year) {
        $scope.datasetCosts = $scope.costs[x].months;
      }
    }
    // for (x in $scope.datasetSalary[0].data) {
    //   $scope.totalSalarySelectedMonth += $scope.datasetSalary[0].data[x].value;
    // }
    // for (x in $scope.datasetCosts[0].data) {
    //   $scope.totalCostSelectedMonth += $scope.datasetCosts[0].data[x].amount;
    //   console.log('adding ' + $scope.datasetCosts[0].data[x].amount + ' to costs');
    // }
    // $scope.plusminus = $scope.totalSalarySelectedMonth - $scope.totalCostSelectedMonth;
    // if ($scope.totalCostSelectedMonth > $scope.totalSalarySelectedMonth) {
    //   $scope.plusminusSign = '-';
    // }
    // else
    //   $scope.plusminusSign = '+';
    $scope.loadMonthsAvailable();
  };

  $scope.fetchData = function() {
    console.log('fetching data');
    $scope.totalCostSelectedMonth = 0;
    $scope.totalSalarySelectedMonth = 0;

    function getCosts() {
      costsPromise.promise
      .then(function () {
        $http.get('js/mockdata/costs.json').then(function(result) {
          costsPromise.resolve(result.data);
        });
      });
      return costsPromise.promise;
    };

    function getSalary() {
      salaryPromise.promise
      .then(function () {
        $http.get('js/mockdata/salary.json').then(function(result) {
          salaryPromise.resolve(result.data);
        });
      });
      return salaryPromise.promise;
    }

    $scope.costs = getCosts();
    $scope.salary = getSalary();

  };
  $scope.fetchData();
});

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
