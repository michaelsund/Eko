var app = angular.module('StarterApp', ['ngMaterial', 'googlechart', 'ngMdIcons', 'angularMoment']);

app.run(function(amMoment) {
  amMoment.changeLocale('sv');
});

app.controller('AppCtrl', ['$scope', '$http', '$mdSidenav', function($scope, $http, $mdSidenav) {
  console.log('loaded main controller');

  // Vars
  $scope.selected = {
    'month': new moment().format('MMMM'),
    'year': new moment().format('YYYY')
  };

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


  // Mock data
  $scope.categories = [
    'Räkningar', 'Övrigt', 'Bilkostnader', 'Kläder'
  ];

  $scope.salary = [
    {
      'year': 2015,
      'months': [
        {
          'month':'Oktober',
          'data': [
            {type:'Skatt',value:2000,by:'Michael'},
            {type:'Lön',value:10000,by:'Emelie'}
          ]
        }
      ]
    },
    {
      'year': 2014,
      'months': [
        {
          'month':'Januari',
          'data': [
            {type:'Skatt',value:1000,by:'Michael'},
            {type:'Lön',value:3000,by:'Emelie'}
          ]
        }
      ]
    }
  ];
  $scope.costs = [
    {
      'year': 2015,
      'months': [
        {
          'month':'Oktober',
          'data': [
            {
              'category':'Räkningar',
              'amount':7000,
              'date':'2015-10-01',
              'by':'Michael'
            }
          ]
        },
        {
          'month':'September',
          'data': [
            {
              'category':'Räkningar',
              'amount':2000,
              'date':'2015-09-01',
              'by':'Michael'
            }
          ]
        }
      ]
    },
    {
      'year': 2014,
      'months': [
        {
          'month':'Januari',
          'data': [
            {
              'category':'Räkningar',
              'amount':1000,
              'date':'2015-10-01',
              'by':'Michael'
            }
          ]
        },
        {
          'month':'November',
          'data': [
            {
              'category':'Räkningar',
              'amount':20000,
              'date':'2015-09-01',
              'by':'Michael'
            }
          ]
        }
      ]
    }
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

  $scope.$watch('selected.year', function() {
    console.log('year changed ' + $scope.selected.year);
  });


  $scope.loadMonths = function() {
    $scope.monthsAvailable = [];
    for (x in $scope.datasetCosts) {
      $scope.monthsAvailable.push($scope.datasetCosts[x].month);
      console.log('TO AVAILABLE ' + $scope.datasetCosts[x].month);
    }
  };


  // Calculations
  $scope.calculations = function() {
    console.log($scope.selected.year);
    $scope.yearsAvailable = [];
    $scope.datasetSalary = [];
    $scope.datasetCosts = [];
    console.log('running calculations');
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
  };

  $scope.fetchData = function() {
    console.log('fetching data');
    $scope.totalCostSelectedMonth = 0;
    $scope.totalSalarySelectedMonth = 0;

    $scope.calculations(function() {
      $scope.loadMonths();
    });
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
