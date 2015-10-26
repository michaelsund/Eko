/* global moment */
/* global angular */
var app = angular.module('StarterApp', ['ngMaterial', 'googlechart', 'ngMdIcons', 'angularMoment', 'ngStorage']);

app.run(function(amMoment) {
  amMoment.changeLocale('sv');
});

app.controller('AppCtrl', function($scope, $http, $q, $mdSidenav, $localStorage, $mdDialog) {
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
    'desc': null,
    'by': null
  };
  $scope.newSalary = {
    'year': moment($scope.selected.date).format('YYYY'),
    'month': moment($scope.selected.date).format('MMMM'),
    'date': $scope.selected.date,
    'value': null,
    'category': null,
    'by': null
  };

  $scope.categories = [
     'Snask', 'Snus', 'Övrigt', 'Mat', 'Bilkostnader', 'Kläder', 'Lovis','Räkningar'
  ];
  
  $scope.saveCost = function() {
    $scope.newCost.year = moment($scope.selected.date).format('YYYY');
    $scope.newCost.month = moment($scope.selected.date).format('MMMM');
    $scope.newCost.date = $scope.selected.date;
    $scope.newCost.by = $scope.$storage.username;
    $http.put('api/cost', $scope.newCost).then(function(result) {
      $scope.sumItUp();
      $scope.newCost = {
        'year': null,
        'month': null,
        'date': $scope.selected.date,
        'category': null,
        'desc': null,
        'amount': null,
        'by':$scope.$storage.username
      };
      $scope.fetchData();
    });
  };

  $scope.deleteCost = function(id) {
    $http.delete('api/cost/'+id).then(function(result) {
      $scope.fetchData();
    });
  };

  $scope.editCost = function(ev, x) {
    var confirm = $mdDialog.confirm()
          .title('Ta bort kostnad?')
          .content('Vill du verkligen ta bort<br>'+ x.amount + ' - ' + x.category)
          // .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Ja')
          .cancel('Nej');
    $mdDialog.show(confirm).then(function() {
      // $scope.status = 'Kostnad borttagen.';
      $scope.deleteCost(x._id);
    }, function() {
      // $scope.status = 'Kostnaden togs inte bort.';
    });
  };

  $scope.editSalary = function(ev, x) {
    var confirm = $mdDialog.confirm()
          .title('Bekräftelse')
          .content('Vill du verkligen ta bort<br>'+ x.value + ' - ' + x.category)
          // .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Ja')
          .cancel('Nej');
    $mdDialog.show(confirm).then(function() {
      // $scope.status = 'Kostnad borttagen.';
      $scope.deleteSalary(x._id);
    }, function() {
      // $scope.status = 'Kostnaden togs inte bort.';
    });
  };

  $scope.deleteSalary = function(id) {
    $http.delete('api/salary/'+id).then(function(result) {
      $scope.fetchData();
    });
  };

  $scope.saveSalary = function() {
    $scope.newSalary.year = moment($scope.selected.date).format('YYYY');
    $scope.newSalary.month = moment($scope.selected.date).format('MMMM');
    $scope.newSalary.date = $scope.selected.date;
    $scope.newSalary.by = $scope.$storage.username;
    $http.put('api/salary', $scope.newSalary).then(function(result) {
      $scope.sumItUp();
      $scope.newSalary = {
        'year': null,
        'month': null,
        'date': $scope.selected.date,
        'category': null,
        'value': null,
        'by':$scope.$storage.username
      };
      $scope.fetchData();
    });
  };

  $scope.clearCost = function() {
    $scope.newCost = {
      'category':null,
      'desc':null,
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
    angular.forEach($scope.costs, function(value, key) {
      // Pick out each year
      if ($scope.yearsAvailable.indexOf($scope.costs[key].year) < 0) {
        $scope.yearsAvailable.push($scope.costs[key].year);
      }
      // Pick out each month for current year
      if ($scope.costs[key].year == $scope.selected.year) {
        if ($scope.monthsAvailable.indexOf($scope.costs[key].month) < 0) {
          $scope.monthsAvailable.push($scope.costs[key].month);
        }
      }
    });
  };

  $scope.pickDataset = function() {
    // reset datasets
    $scope.datasetCosts = [];
    $scope.categoryChart = {};
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
        if ($scope.categoryChart[value.category]) {
          $scope.categoryChart[value.category] += value.amount;
        }
        else {
          $scope.categoryChart[value.category] = value.amount;
        }
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
    // main chart final sorted
    $scope.chartDataCategory = [];
    for (x in $scope.categoryChart) {
      $scope.chartDataCategory.push({'c':[{'v':x},{'v':$scope.categoryChart[x]}]})
    }
    // piechart month categories
    $scope.chartObjectMonth = {};
    $scope.chartObjectMonth.type = "PieChart";
    $scope.chartObjectMonth.data = {"cols": [
        {id: "t", label: "Kategori", type: "string"},
        {id: "s", label: "Utgift", type: "number"}
    ], "rows": [
        {c: [
            {v: "Mushrooms"},
            {v: 3},
        ]}
    ]};
    $scope.chartObjectMonth.options = {
      'legend': { position: 'top' },
      'is3D': false,
    };
    //main category chart for year/month
    $scope.chartObjectMonth.data.rows = $scope.chartDataCategory;
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

  $scope.test = function() {
    console.log($scope.monthsAvailable);
    console.log($scope.chartData);
  };

});

app.controller('compareCharts', function ($scope, $http) {
  console.log('running compareCharts');
  // get data for the selected months
  $http.post('api/monthschart', {'year':$scope.selected.year,'months':$scope.monthsAvailable}).then(function(result) {
    // first array element is the costs object, second is salary object, loop through and pick out each
    // month from both objects and put into a dataobject for that month
    // Note: the two objects recieved will always have the same months! although not sorted if mismatch in query
    $scope.chartData = [];
    for (x in result.data[0]) {
      $scope.chartData.push({'c':[{'v':x},{'v':result.data[1][x]},{'v':'#2857bd'},{'v':result.data[0][x]},{'v':'#e2431e'}]})
    }
    $scope.chartObject.data.rows = $scope.chartData;
  });

  $scope.chartObject = {};
  $scope.chartObject.type = "ColumnChart";

  // $scope.data1 = [
  //     {v: 'Oktober'},
  //     {v: 100},
  //     {v: '#2857bd'},
  //     {v: 40},
  //     {v: '#e2431e'},
  // ];

  $scope.chartObject.data = {'cols': [
      {id: 'test1', label: 'Månad', type: 'string'},
      {id: 'test3', label: 'Inkomster', type: 'number'},
      {role: 'style', type: 'string'},
      {id: 'test5', label: 'Utgifter', type: 'number'},
      {role: 'style', type: 'string'}
  ], 'rows': [
        // {c: $scope.data1},
  ]};

  $scope.chartObject.options = {
      'title': '',
      'legend': { position: 'bottom' }
  };
});
