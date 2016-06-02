(function () {
    'use strict';
    angular.module('edu.ucar.scied.model_it.controller', [])
        .controller('modelItCtrl', modelItCtrl);
    modelItCtrl.$inject = ['$rootScope', '$scope', 'ContentData', 'Footer', 'WebApp'];
    function modelItCtrl($rootScope, $scope, ContentData, Footer, WebApp) {
        WebApp.setShowFooter(true);       
        Footer.setBackButton(false);       
        Footer.setPageTitle("Model It Out");
        $scope.allFactors = [];
        $scope.selectedFactor = {};
        $scope.tempLimit = 2;
        $scope.historicalData = [];
        $scope.showBadge = false;
        var targetTemp = 0;
        var columnMask = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        $scope.selectFactor = selectFactorFunc;
        $scope.toggleFactor = toggleFactorFunc;
        $scope.resetModel = resetModelFunc;


        var dataTableUsual = [
          ['Year', 'Baseline', 'Coal Power Plants', 'Natual Gas', 'Waste', 'Farming', 'Factories', 'Buildings', 'Houses', 'Ships', 'Planes', 'Cars & Trucks'],
          //['2010',  56.5,       0.5,    0.28,  0.12,  0.26,  0.25,  0.29,  0.17,  0.03,  0.04,  0.27],
          ['2015', 56.5, 0.55, 0.30, 0.13, 0.28, 0.28, 0.32, 0.19, 0.04, 0.05, 0.3],
          ['2020', 56.5, 0.59, 0.32, 0.13, 0.3, 0.3, 0.34, 0.2, 0.04, 0.05, 0.33],
          ['2030', 56.5, 0.71, 0.37, 0.15, 0.34, 0.35, 0.41, 0.24, 0.05, 0.05, 0.39],
          ['2040', 56.5, 0.83, 0.43, 0.17, 0.39, 0.42, 0.48, 0.29, 0.06, 0.06, 0.46],
          ['2050', 56.5, 0.98, 0.5, 0.19, 0.45, 0.49, 0.57, 0.34, 0.07, 0.07, 0.54],
          ['2060', 56.5, 1.14, 0.57, 0.21, 0.5, 0.57, 0.66, 0.39, 0.08, 0.09, 0.63],
          ['2070', 56.5, 1.31, 0.63, 0.23, 0.55, 0.66, 0.76, 0.45, 0.09, 0.1, 0.72],
          ['2080', 56.5, 1.47, 0.69, 0.24, 0.59, 0.74, 0.85, 0.51, 0.1, 0.11, 0.81],
          ['2090', 56.5, 1.63, 0.74, 0.25, 0.62, 0.82, 0.94, 0.56, 0.11, 0.12, 0.9],
          ['2100', 56.5, 1.77, 0.79, 0.26, 0.66, 0.89, 1.03, 0.61, 0.12, 0.14, 0.98]
        ];
        var dataTablePolicy = [
          ['Year', 'Baseline', 'Coal Power Plants', 'Natual Gas', 'Waste', 'Farming', 'Factories', 'Buildings', 'Houses', 'Ships', 'Planes', 'Cars & Trucks'],
          //['2010',  56.5,       0.5,    0.28,  0.12,  0.26,  0.25,  0.29,  0.17,  0.03,  0.04,  0.27],
          ['2015', 56.5, 0.54, 0.29, 0.12, 0.27, 0.27, 0.32, 0.19, 0.04, 0.04, 0.30],
          ['2020', 56.5, 0.58, 0.29, 0.11, 0.27, 0.29, 0.34, 0.2, 0.04, 0.04, 0.32],
          ['2030', 56.5, 0.64, 0.29, 0.1, 0.26, 0.32, 0.37, 0.22, 0.04, 0.05, 0.36],
          ['2040', 56.5, 0.68, 0.29, 0.09, 0.26, 0.34, 0.39, 0.23, 0.05, 0.05, 0.37],
          ['2050', 56.5, 0.69, 0.29, 0.08, 0.26, 0.34, 0.4, 0.24, 0.05, 0.05, 0.38],
          ['2060', 56.5, 0.68, 0.28, 0.08, 0.25, 0.34, 0.4, 0.23, 0.05, 0.05, 0.38],
          ['2070', 56.5, 0.67, 0.27, 0.07, 0.24, 0.34, 0.39, 0.23, 0.05, 0.05, 0.37],
          ['2080', 56.5, 0.65, 0.26, 0.07, 0.24, 0.33, 0.38, 0.22, 0.04, 0.05, 0.36],
          ['2090', 56.5, 0.64, 0.25, 0.07, 0.24, 0.32, 0.37, 0.22, 0.04, 0.05, 0.35],
          ['2100', 56.5, 0.62, 0.25, 0.07, 0.23, 0.31, 0.36, 0.21, 0.04, 0.05, 0.34]
        ];



        ContentData('data/modelItOut/model_it_out.json')
            .success(processData);

        function processData(list) {
            $scope.data = list['data'];
            $scope.allFactors = $scope.data.factors;
            $scope.tempLimit = $scope.data.temp_limit;
            $scope.historicalData = $scope.data.historical_data;

            init();
        }

        function init() {
            if (!$rootScope.modelChartHasInitialized) {
                google.charts.load('current', {
                    'packages': ['corechart']
                });
                google.charts.setOnLoadCallback(function () {
                    drawChart();
                    drawHistoricalChart()
                });
            } else {
                drawChart();
                drawHistoricalChart();
            }
        }


        function drawChart() {


            /*var dataTableUsual = [
                ['Year', 'Coal Power Plants', 'Natual Gas', 'Waste', 'Farming', 'Factories', 'Buildings', 'Houses', 'Ships', 'Planes', 'Cars & Trucks'],
                ['2010',  0.5,    0.28,  0.12,  0.26,  0.25,  0.29,  0.17,  0.03,  0.04,  0.27],
                ['2020',  0.59,   0.32,  0.13,  0.3,   0.3,   0.34,  0.2,   0.04,  0.05,  0.33],
                ['2030',  0.71,   0.37,  0.15,  0.34,  0.35,  0.41,  0.24,  0.05,  0.05,  0.39],
                ['2040',  0.83,   0.43,  0.17,  0.39,  0.42,  0.48,  0.29,  0.06,  0.06,  0.46],
                ['2050',  0.98,   0.5,   0.19,  0.45,  0.49,  0.57,  0.34,  0.07,  0.07,  0.54],
                ['2060',  1.14,   0.57,  0.21,  0.5,   0.57,  0.66,  0.39,  0.08,  0.09,  0.63],
                ['2070',  1.31,   0.63,  0.23,  0.55,  0.66,  0.76,  0.45,  0.09,  0.1,   0.72],
                ['2080',  1.47,   0.69,  0.24,  0.59,  0.74,  0.85,  0.51,  0.1,   0.11,  0.81],
                ['2090',  1.63,   0.74,  0.25,  0.62,  0.82,  0.94,  0.56,  0.11,  0.12,  0.9],
                ['2100',  1.77,   0.79,  0.26,  0.66,  0.89,  1.03,  0.61,  0.12,  0.14,  0.98]
              ];
            var dataTablePolicy = [
                ['Year', 'Coal Power Plants', 'Natual Gas', 'Waste', 'Farming', 'Factories', 'Buildings', 'Houses', 'Ships', 'Planes', 'Cars & Trucks'],
                ['2010',  0.5,    0.28,  0.12,  0.26,  0.25,  0.29,  0.17,  0.03,  0.04,  0.27],
                ['2020',  0.58,   0.29,  0.11,  0.27,  0.29,  0.34,  0.2,   0.04,  0.04,  0.32],
                ['2030',  0.64,   0.29,  0.1,   0.26,  0.32,  0.37,  0.22,  0.04,  0.05,  0.36],
                ['2040',  0.68,   0.29,  0.09,  0.26,  0.34,  0.39,  0.23,  0.05,  0.05,  0.37],
                ['2050',  0.69,   0.29,  0.08,  0.26,  0.34,  0.4,   0.24,  0.05,  0.05,  0.38],
                ['2060',  0.68,   0.28,  0.08,  0.25,  0.34,  0.4,   0.23,  0.05,  0.05,  0.38],
                ['2070',  0.67,   0.27,  0.07,  0.24,  0.34,  0.39,  0.23,  0.05,  0.05,  0.37],
                ['2080',  0.65,   0.26,  0.07,  0.24,  0.33,  0.38,  0.22,  0.04,  0.05,  0.36],
                ['2090',  0.64,   0.25,  0.07,  0.24,  0.32,  0.37,  0.22,  0.04,  0.05,  0.35],
                ['2100',  0.62,   0.25,  0.07,  0.23,  0.31,  0.36,  0.21,  0.04,  0.05,  0.34]
              ];*/

            /*var dataTableUsual = [
                ['Year', 'Coal Power Plants', 'Natual Gas', 'Waste', 'Farming', 'Factories', 'Buildings', 'Houses', 'Ships', 'Planes', 'Cars & Trucks'],
                ['2010',  57,      56.78,  0.12,  0.26,  0.25,  0.29,  0.17,  0.03,  0.04,  0.27],
                ['2020',  57.09,   56.82,  0.13,  0.3,   0.3,   0.34,  0.2,   0.04,  0.05,  0.33],
                ['2030',  57.21,   56.87,  0.15,  0.34,  0.35,  0.41,  0.24,  0.05,  0.05,  0.39],
                ['2040',  57.33,   56.93,  0.17,  0.39,  0.42,  0.48,  0.29,  0.06,  0.06,  0.46],
                ['2050',  57.48,   57,   0.19,  0.45,  0.49,  0.57,  0.34,  0.07,  0.07,  0.54],
                ['2060',  57.64,   57.07,  0.21,  0.5,   0.57,  0.66,  0.39,  0.08,  0.09,  0.63],
                ['2070',  57.81,   57.13,  0.23,  0.55,  0.66,  0.76,  0.45,  0.09,  0.1,   0.72],
                ['2080',  57.97,   57.19,  0.24,  0.59,  0.74,  0.85,  0.51,  0.1,   0.11,  0.81],
                ['2090',  58.13,   57.24,  0.25,  0.62,  0.82,  0.94,  0.56,  0.11,  0.12,  0.9],
                ['2100',  58.27,   57.29,  0.26,  0.66,  0.89,  1.03,  0.61,  0.12,  0.14,  0.98]
              ];
            var dataTablePolicy = [
                ['Year', 'Coal Power Plants', 'Natual Gas', 'Waste', 'Farming', 'Factories', 'Buildings', 'Houses', 'Ships', 'Planes', 'Cars & Trucks'],
                ['2010',  57,    0.28,  0.12,  0.26,  0.25,  0.29,  0.17,  0.03,  0.04,  0.27],
                ['2020',  57.08,   0.29,  0.11,  0.27,  0.29,  0.34,  0.2,   0.04,  0.04,  0.32],
                ['2030',  57.14,   0.29,  0.1,   0.26,  0.32,  0.37,  0.22,  0.04,  0.05,  0.36],
                ['2040',  57.18,   0.29,  0.09,  0.26,  0.34,  0.39,  0.23,  0.05,  0.05,  0.37],
                ['2050',  57.19,   0.29,  0.08,  0.26,  0.34,  0.4,   0.24,  0.05,  0.05,  0.38],
                ['2060',  57.18,   0.28,  0.08,  0.25,  0.34,  0.4,   0.23,  0.05,  0.05,  0.38],
                ['2070',  57.17,   0.27,  0.07,  0.24,  0.34,  0.39,  0.23,  0.05,  0.05,  0.37],
                ['2080',  57.15,   0.26,  0.07,  0.24,  0.33,  0.38,  0.22,  0.04,  0.05,  0.36],
                ['2090',  57.14,   0.25,  0.07,  0.24,  0.32,  0.37,  0.22,  0.04,  0.05,  0.35],
                ['2100',  57.12,   0.25,  0.07,  0.23,  0.31,  0.36,  0.21,  0.04,  0.05,  0.34]
              ];
              */


            var data = new google.visualization.DataTable();
            var dataTableLength = dataTableUsual[0].length + 1; // was -2 before I wanted to add two columns to the beginning of the chart
            data.addRows(dataTableLength);

            //how many columns should I calculate? y is an index in the original, can't be an index in the new smaller table
            /*var newDataLength = columnMask.filter(function(x){return x==1}).length;
             */
            var newYIndex = 0; //increase only if columnMask is 1
            targetTemp = 0;

            for (var x = 0; x < 11; x++) {
                //x is for lines
                newYIndex = 0;
                for (var y = 0; y < dataTableUsual[x].length; y++) {
                    //y is for colums
                    if ((x == 0) && (y == 0)) {
                        //special case for year because it's string
                        data.addColumn('string', dataTableUsual[0][0]);
                        //data.addColumn({label: 'Style', type: 'string', role: 'style'});
                    } else {
                        if (x == 0) {
                            //addColums
                            data.addColumn('number', dataTableUsual[0][y]);
                            if (y == (dataTableUsual[x].length - 1)) {
                                data.addColumn('number', 'temp');
                            }
                        } else {
                            //x>0
                            if (columnMask[y] == 1) //strong policy
                            {
                                var value = (y == 0 ? dataTablePolicy[x][y] : (y > 1 ? (dataTablePolicy[x][y] + 56.5) : dataTablePolicy[x][y]));
                                data.setCell((x + 2), newYIndex, dataTablePolicy[x][y]);
                            } else {
                                var value = (y == 0 ? dataTableUsual[x][y] : (y > 1 ? (dataTableUsual[x][y] + 56.5) : dataTableUsual[x][y]));
                                data.setCell((x + 2), newYIndex, dataTableUsual[x][y]);
                            }

                            if (y == (dataTableUsual[x].length - 1)) {
                                data.setCell((x + 2), newYIndex + 1, ($scope.tempLimit + 56.5));
                            }

                            if (x == 10 & y > 0) {
                                targetTemp += (columnMask[y] == 1 ? dataTablePolicy[x][y] : dataTableUsual[x][y]);
                            }

                            newYIndex++;
                        }
                    }
                }
            } //end of two for loops

            data.setCell((0), 12, ($scope.tempLimit + 56.5));
            data.setCell((1), 12, ($scope.tempLimit + 56.5));
            data.setCell((2), 12, ($scope.tempLimit + 56.5));

            data.setCell((0), 0, '1900'); //add the label to the horizontal axis


            var options_stacked = {
                /*animation : 
                  { duration: 1000,
                    easing: 'out',
                    startup: true
                  },*/
                title: 'Climate Change Model',
                titlePosition: 'none',
                titleTextStyle: {
                    color: '#0c1c48',
                    fontSize: '28',
                    fontName: 'Roboto Slab',
                    left: '200'
                },
                isStacked: 'absolute',
                height: 690,
                areaOpacity: 0.5,
                legend: {
                    position: 'none'
                },
                series: {
                    11: {
                        type: 'line',
                        color: '#f23573',
                        lineDashStyle: [2, 2]
                    }
                },
                colors: ['#dcf8fa', '#b720dd', '#f6705a', '#f89b2d', '#fbcb0a', '#91d957', '#46d999', '#3cd6d8', '#60bcfd', '#96a6fb', '#4459c8', '#f23573'],
                //vAxis: {minValue: 0, ticks: [0, 1, 2, 3, 3.6, 4, 5, 6, 6.7], title:"Average Temperature Increase in Degrees F"},
                vAxis: {
                    minValue: 56.3,
                    ticks: [57, 58, 59, 60, 61, 62, 63, 64],
                    title: "Average global temperature (degrees F)",
                    titleTextStyle: {
                        italic: false,
                        bold: true,
                        fontSize: 18
                    },
                    format: '##.#',
                    viewWindowMode: 'explicit',
                    viewWindow: {
                        max: 64,
                        min: 56.3
                    }
                },
                hAxis: {
                    minValue: 1900,
                    ticks: [1900, 2010, 2020, 2030, 2040, 2050, 2060, 2070, 2080, 2090],
                    title: "",
                    titleTextStyle: {
                        italic: false,
                        bold: true,
                        left: 10
                    }
                },
                backgroundColor: '#dcf8fa',
                chartArea: {
                    left: 80,
                    top: 30,
                    width: "90%",
                    height: "88%"
                },
                enableInteractivity: false
                    //tooltip: {trigger: 'none'}
            };

            var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
            chart.draw(data, options_stacked);

            $rootScope.modelChartHasInitialized = true;

            checkBadge();

        }

        function checkBadge() {
            var countOnes = 0;
            $scope.showGoldenBadge = false;
            $scope.showBadge = false;
            angular.forEach(columnMask, function (item) {
                countOnes += item ? 1 : 0;
            });
            if (targetTemp < 60.1) {
                $scope.showBadge = true;
                if (countOnes < 9)
                    $scope.showGoldenBadge = true;
            }
        }

        function drawHistoricalChart() {
            //HISTORICAL DATA -- SECOND CHART

            var historical_data = google.visualization.arrayToDataTable($scope.historicalData);

            var hoptions = {
                x: {
                    0: {
                        side: 'top'
                    }
                },
                curveType: 'function',
                colors: ['#333'],
                legend: {
                    position: 'none'
                },
                vAxis: {
                    textPosition: 'none',
                    gridlines: {
                        color: 'transparent'
                    },
                    baselineColor: 'transparent'
                },
                hAxis: {
                    format: 'none',
                    textPosition: 'none',
                    gridlines: {
                        color: 'transparent'
                    }
                },
                //chartArea:{left:0,top:"64.5%",width:"100%", height:"1000px"}, 
                chartArea: {
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%"
                },
                //backgroundColor: { fill:'#DDD' },
                backgroundColor: {
                    fill: 'transparent'
                },
                enableInteractivity: false
            };


            var chart_historical = new google.visualization.LineChart(document.getElementById('chart_historical_div'));
            chart_historical.draw(historical_data, hoptions);
        }


        function selectFactorFunc(anIndex) {
            $scope.selectedFactor = $scope.allFactors[anIndex - 1];
        }

        function toggleFactorFunc(anIndex) {
            columnMask[anIndex] = (columnMask[anIndex] == 1) ? 0 : 1; //columnMask[0] is always 1 because it holds the years
            drawChart();
        }

        function resetModelFunc() {
            columnMask = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.selectedFactor = {};
            angular.forEach($scope.allFactors, function (anItem, key) {
                anItem.policy = 'usual'
            });
            drawChart();
        }


    };

    /*Original
            var data = google.visualization.arrayToDataTable([
              ['Year', 'Coal', 'Oil', 'Gas', 'Houses', 'Buildings', 'Cars & Trucks', 'Ships', 'Planes', 'Factories', 'Farming', 'Garbage'],
              ['2010',  0.5,    0.05,  0.28,  0.17,  0.29,  0.27,  0.03,  0.04,  0.25,  0.26,  0.12],
              ['2020',  0.59,   0.06,  0.32,  0.2,  0.34,  0.33,  0.04,  0.05,  0.3,  0.3,  0.13],
              ['2030',  0.71,   0.07,  0.37,  0.24,  0.41,  0.39,  0.05,  0.05,  0.35,  0.34,  0.15],
              ['2040',  0.83,   0.08,  0.43,  0.29,  0.48,  0.46,  0.06,  0.06,  0.42,  0.39,  0.17],
              ['2050',  0.98,   0.1,   0.5,  0.34,  0.57,  0.54,  0.07,  0.07,  0.49,  0.45,  0.19],
              ['2060',  1.14,   0.11,  0.57,  0.39,  0.66,  0.63,  0.08,  0.09,  0.57,  0.5,  0.21],
              ['2070',  1.31,   0.13,  0.63,  0.45,  0.76,  0.72,  0.09,  0.1,  0.66,  0.55,  0.23],
              ['2080',  1.47,   0.15,  0.69,  0.51,  0.85,  0.81, 0.1,  0.11,  0.74,  0.59,  0.24],
              ['2090',  1.63,   0.16,  0.74,  0.56,  0.94,  0.9, 0.11,  0.12,  0.82,  0.62,  0.25],
              ['2100',  1.77,   0.18,  0.79,  0.61,  1.03,  0.98,  0.12,  0.14,  0.89,  0.66,  0.26]
            ]);*/

    /*Test1*/
    /*var data = new google.visualization.DataTable();
    data.addColumn('string', 'Year');
    data.addColumn('number', 'Coal');
    data.addColumn('number', 'Oil');
    data.addColumn('number', 'Gas');
    data.addColumn('number', 'Houses');
    data.addColumn('number', 'Buildings');
    data.addColumn('number', 'Cars & Trucks');
    data.addColumn('number', 'Ships');
    data.addColumn('number', 'Planes');
    data.addColumn('number', 'Factories');
    data.addColumn('number', 'Farming');
    data.addColumn('number', 'Garbage');

    data.addRow(['2010', 0.5,    0.05,  0.28,  0.17,  0.29,  0.27,  0.03,  0.04,  0.25,  0.26,  0.12 ]);
    data.addRow(['2020', 0.59,   0.06,  0.32,  0.2,  0.34,  0.33,  0.04,  0.05,  0.3,  0.3,  0.13]);
    data.addRow(['2030', 0.71,   0.07,  0.37,  0.24,  0.41,  0.39,  0.05,  0.05,  0.35,  0.34,  0.15 ]);
    data.addRow(['2040', 0.83,   0.08,  0.43,  0.29,  0.48,  0.46,  0.06,  0.06,  0.42,  0.39,  0.17 ]);
    data.addRow(['2050', 0.98,   0.1,   0.5,  0.34,  0.57,  0.54,  0.07,  0.07,  0.49,  0.45,  0.19 ]);
    data.addRow(['2060', 1.14,   0.11,  0.57,  0.39,  0.66,  0.63,  0.08,  0.09,  0.57,  0.5,  0.21 ]);
    data.addRow(['2070', 1.31,   0.13,  0.63,  0.45,  0.76,  0.72,  0.09,  0.1,  0.66,  0.55,  0.23 ]);
    data.addRow(['2080', 1.47,   0.15,  0.69,  0.51,  0.85,  0.81, 0.1,  0.11,  0.74,  0.59,  0.24 ]);
    data.addRow(['2090', 1.63,   0.16,  0.74,  0.56,  0.94,  0.9, 0.11,  0.12,  0.82,  0.62,  0.25 ]);
    data.addRow(['2100', 1.77,   0.18,  0.79,  0.61,  1.03,  0.98,  0.12,  0.14,  0.89,  0.66,  0.26 ]);
    */

    /*Example1
    var data = new google.visualization.DataTable();
     
    data.addColumn('number', 'Initial Value');
    data.addColumn('number', 'Doubled');
    data.addColumn('number', 'Squared');
    data.addColumn('number', 'Plus 50');
     
    var x;
    for (x = 0; x <= 10; x++) {
      data.addRow([x, 2 * x, x* x, x+50]);
    }



    Example2
    var data = new google.visualization.DataTable();
        data.addColumn("string", "Country");
        data.addColumn("number", "Population in millions");
        data.addRows(dataObject);
     
        // Create and draw the visualization.
        new google.visualization.GeoChart(
          document.getElementById('my_chart')).draw(data, null);
      }
    */

    /*[1880,  -0.234],
            [1881,  -0.126],
            [1882,  -0.126],
            [1883,  -0.27],
            [1884, -0.378],
            [1885,-0.414],
            [1886,  -0.378],
            [1887,  -0.468],
            [1888,  -0.288],
            [1889,  -0.198],
            [1890,  -0.594],
            [1891,  -0.45],
            [1892,  -0.558],
            [1893,  -0.576],
            [1894,  -0.504],
            [1895,  -0.414],
            [1896,  -0.162],
            [1897,  -0.216],
            [1898,  -0.468],
            [1899,  -0.216],
            [1900,  -0.126],
            [1901,  -0.252],
            [1902,  -0.45],
            [1903,  -0.612],
            [1904,  -0.756],
            [1905,  -0.522],
            [1906,  -0.378],
            [1907,  -0.666],
            [1908,  -0.774],
            [1909,  -0.756],
            [1910,  -0.666],
            [1911,  -0.774],
            [1912,  -0.576],
            [1913,  -0.558],
            [1914,  -0.234],
            [1915,  -0.108],
            [1916,  -0.504],
            [1917,  -0.54],
            [1918,  -0.36],
            [1919,  -0.36]
            ]);
            /*1920  -0.36
            1921  -0.252
            1922  -0.396
            1923  -0.378
            1924  -0.432
            1925  -0.252
            1926  -0.108
            1927  -0.252
            1928  -0.306
            1929  -0.522
            1930  -0.162
            1931  -0.126
            1932  -0.198
            1933  -0.432
            1934  -0.18
            1935  -0.252
            1936  -0.198
            1937  -0.036
            1938  -0.054
            1939  -0.018
            1940  0.162
            1941  0.342
            1942  0.27
            1943  0.27
            1944  0.522
            1945  0.306
            1946  -0.018
            1947  -0.09
            1948  -0.09
            1949  -0.108
            1950  -0.288
            1951  -0.018
            1952  0.036
            1953  0.162
            1954  -0.216
            1955  -0.252
            1956  -0.36
            1957  0.09
            1958  0.198
            1959  0.108
            1960  0.036
            1961  0.126
            1962  0.162
            1963  0.18
            1964  -0.27
            1965  -0.144
            1966  -0.054
            1967  -0.036
            1968  -0.054
            1969  0.162
            1970  0.054
            1971  -0.144
            1972  0.036
            1973  0.288
            1974  -0.144
            1975  0
            1976  -0.144
            1977  0.342
            1978  0.198
            1979  0.396
            1980  0.468
            1981  0.54
            1982  0.324
            1983  0.612
            1984  0.252
            1985  0.234
            1986  0.396
            1987  0.666
            1988  0.666
            1989  0.522
            1990  0.774
            1991  0.72
            1992  0.45
            1993  0.504
            1994  0.594
            1995  0.81
            1996  0.576
            1997  0.918
            1998  1.134
            1999  0.792
            2000  0.756
            2001  0.972
            2002  1.08
            2003  1.098
            2004  1.026
            2005  1.17
            2006  1.098
            2007  1.098
            2008  0.972
            2009  1.134
            2010  1.26
            2011  1.026
            2012  1.116
            2013  1.188
            2014  1.332
            2015  1.62*/
})();