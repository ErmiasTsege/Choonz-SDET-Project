/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.19484702093398, "KoPercent": 0.8051529790660226};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5248386465871309, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Delete Album-0"], "isController": false}, {"data": [0.496551724137931, 500, 1500, "Delete Album-1"], "isController": false}, {"data": [0.09137931034482759, 500, 1500, "Delete Album-2"], "isController": false}, {"data": [0.26975476839237056, 500, 1500, "Upadate Album-7"], "isController": false}, {"data": [0.14168937329700274, 500, 1500, "Upadate Album-6"], "isController": false}, {"data": [0.5408719346049047, 500, 1500, "Upadate Album-8"], "isController": false}, {"data": [0.8351498637602179, 500, 1500, "Upadate Album-3"], "isController": false}, {"data": [0.14986376021798364, 500, 1500, "Upadate Album-2"], "isController": false}, {"data": [0.9237057220708447, 500, 1500, "Upadate Album-5"], "isController": false}, {"data": [0.9100817438692098, 500, 1500, "Upadate Album-4"], "isController": false}, {"data": [0.14168937329700274, 500, 1500, "Upadate Album-1"], "isController": false}, {"data": [0.9291553133514986, 500, 1500, "Upadate Album-0"], "isController": false}, {"data": [0.0, 500, 1500, "Upadate Album"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Album"], "isController": false}, {"data": [0.013071895424836602, 500, 1500, "CreateAlbum"], "isController": false}, {"data": [0.0, 500, 1500, "Album Transaction Controller"], "isController": true}, {"data": [0.12418300653594772, 500, 1500, "CreateAlbum-3"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Album-3"], "isController": false}, {"data": [0.1503267973856209, 500, 1500, "CreateAlbum-2"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Album-4"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbum-5"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Album-5"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbum-4"], "isController": false}, {"data": [0.4103448275862069, 500, 1500, "Delete Album-6"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "CreateAlbum-7"], "isController": false}, {"data": [0.4206896551724138, 500, 1500, "Delete Album-7"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbum-6"], "isController": false}, {"data": [0.28793103448275864, 500, 1500, "Delete Album-8"], "isController": false}, {"data": [0.34967320261437906, 500, 1500, "CreateAlbum-9"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "CreateAlbum-8"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbum-1"], "isController": false}, {"data": [0.9967320261437909, 500, 1500, "CreateAlbum-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9936, 80, 0.8051529790660226, 2127.7751610305977, 1, 37946, 665.5, 6079.600000000002, 10846.699999999986, 16876.93999999989, 76.68086682719021, 5462.939236070916, 20.673904093929433], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete Album-0", 290, 0, 0.0, 6.220689655172417, 2, 144, 4.0, 10.0, 16.44999999999999, 38.089999999999975, 3.0813366625936354, 10.209936812675982, 0.39419443632789675], "isController": false}, {"data": ["Delete Album-1", 290, 0, 0.0, 920.5758620689653, 300, 5129, 696.5, 1668.200000000001, 2256.6499999999987, 3778.149999999969, 3.056299137912864, 16.000800467139516, 0.8028754571275004], "isController": false}, {"data": ["Delete Album-2", 290, 0, 0.0, 3061.131034482759, 805, 36630, 2500.0, 5019.8, 6402.449999999999, 12103.319999999901, 2.71629684441239, 428.23342685726794, 0.4376845501250433], "isController": false}, {"data": ["Upadate Album-7", 367, 0, 0.0, 1984.1416893732974, 176, 11150, 1818.0, 3865.3999999999996, 5573.999999999976, 9021.719999999996, 3.203813148728514, 69.43745478269504, 0.5037245282668855], "isController": false}, {"data": ["Upadate Album-6", 367, 0, 0.0, 2478.528610354223, 284, 9101, 2187.0, 4121.8, 4971.999999999995, 6111.999999999995, 3.167916857288367, 225.3872261791211, 0.43620730163833954], "isController": false}, {"data": ["Upadate Album-8", 367, 0, 0.0, 1075.602179836512, 61, 9241, 769.0, 2385.9999999999995, 2863.1999999999966, 5906.599999999986, 3.2133225930725318, 191.94748410576383, 0.5114956862019753], "isController": false}, {"data": ["Upadate Album-3", 367, 0, 0.0, 559.2942779291562, 3, 5901, 9.0, 2513.9999999999986, 4493.599999999999, 4820.919999999999, 3.1976997473207285, 120.17292907826523, 0.4153262367125556], "isController": false}, {"data": ["Upadate Album-2", 367, 0, 0.0, 3893.9482288828335, 396, 21784, 3570.0, 7430.0, 9283.599999999997, 13780.64, 3.108588853125529, 490.0795361601093, 0.5008956648102659], "isController": false}, {"data": ["Upadate Album-5", 367, 0, 0.0, 166.58583106267062, 1, 2618, 4.0, 684.1999999999998, 1278.1999999999991, 2060.519999999999, 3.2168432862639915, 3.911103409569013, 0.40210541078299894], "isController": false}, {"data": ["Upadate Album-4", 367, 0, 0.0, 196.474114441417, 1, 2342, 4.0, 920.3999999999999, 1440.9999999999993, 1975.5599999999988, 3.212281945575016, 9.715270688911938, 0.401535243196877], "isController": false}, {"data": ["Upadate Album-1", 367, 0, 0.0, 2212.196185286103, 222, 7148, 2004.0, 3803.0, 4817.4, 6088.92, 3.0874843312273383, 16.16406591768531, 0.811067661230619], "isController": false}, {"data": ["Upadate Album-0", 367, 0, 0.0, 202.1852861035421, 3, 5066, 5.0, 505.79999999999995, 1279.1999999999998, 3979.9999999999973, 3.133752305485347, 10.38361481690604, 0.400899953143145], "isController": false}, {"data": ["Upadate Album", 367, 0, 0.0, 12976.032697547682, 3778, 29607, 12657.0, 19549.2, 21989.0, 25659.679999999993, 2.9821154330567903, 1075.2869879821562, 4.132443163581627], "isController": false}, {"data": ["Delete Album", 290, 17, 5.862068965517241, 8410.158620689654, 3280, 37946, 7615.0, 13196.800000000001, 15701.199999999999, 21501.509999999947, 2.682130536518595, 956.6182998038114, 3.69509183117838], "isController": false}, {"data": ["CreateAlbum", 306, 23, 7.516339869281046, 11138.415032679743, 702, 22308, 11200.5, 16983.4, 18808.25, 21584.960000000003, 2.8824415975885453, 1113.1134424159288, 4.063009622857009], "isController": false}, {"data": ["Album Transaction Controller", 290, 40, 13.793103448275861, 31059.313793103454, 10390, 58880, 30406.0, 41028.30000000001, 44742.9, 49453.94999999991, 2.2459727385377946, 2477.5942134739003, 9.371127633209417], "isController": true}, {"data": ["CreateAlbum-3", 306, 0, 0.0, 2851.0882352941185, 198, 12756, 2415.0, 4994.400000000001, 5832.449999999996, 9422.32, 2.9465859083862145, 464.5389580063361, 0.4747916746911381], "isController": false}, {"data": ["Delete Album-3", 290, 0, 0.0, 11.010344827586195, 3, 155, 5.0, 22.900000000000034, 33.44999999999999, 120.34999999999962, 2.764405891044278, 103.88928896978219, 0.3590488120203994], "isController": false}, {"data": ["CreateAlbum-2", 306, 0, 0.0, 2826.7352941176473, 146, 10901, 2148.5, 5320.900000000001, 6966.849999999995, 9270.810000000005, 3.0431409988662805, 95.46701119547706, 0.49926532012649916], "isController": false}, {"data": ["Delete Album-4", 290, 0, 0.0, 4.86551724137931, 1, 89, 3.0, 8.0, 12.0, 50.169999999999675, 2.764405891044278, 8.65766571540918, 0.34555073638053474], "isController": false}, {"data": ["CreateAlbum-5", 306, 0, 0.0, 6.6862745098039245, 1, 137, 3.0, 13.0, 23.649999999999977, 65.09000000000009, 2.9531263571352744, 3.590471010384196, 0.3691407946419093], "isController": false}, {"data": ["Delete Album-5", 290, 0, 0.0, 4.458620689655169, 1, 50, 3.0, 7.900000000000034, 12.0, 33.809999999999775, 2.7643268387539557, 3.3609247209459716, 0.34554085484424446], "isController": false}, {"data": ["CreateAlbum-4", 306, 0, 0.0, 13.918300653594779, 2, 278, 7.0, 27.30000000000001, 43.899999999999864, 143.93, 2.953040860049024, 110.97839005592442, 0.3835492523305862], "isController": false}, {"data": ["Delete Album-6", 290, 17, 5.862068965517241, 1434.655172413794, 1, 9087, 891.5, 3627.700000000005, 4522.599999999999, 5701.149999999989, 2.7600909878270468, 185.26921148245438, 0.35777270472261086], "isController": false}, {"data": ["CreateAlbum-7", 306, 23, 7.516339869281046, 2417.7156862745105, 29, 12294, 1860.5, 5257.200000000001, 5854.299999999999, 9032.430000000004, 2.9159797596699035, 192.4270067015123, 0.3713373811214134], "isController": false}, {"data": ["Delete Album-7", 290, 0, 0.0, 1252.9586206896554, 119, 7605, 828.0, 2903.3000000000006, 3415.249999999998, 5664.0699999999615, 2.7637472600781474, 59.89979182550271, 0.4345344813208806], "isController": false}, {"data": ["CreateAlbum-6", 306, 0, 0.0, 6.552287581699341, 1, 132, 3.0, 10.300000000000011, 16.0, 81.83000000000021, 2.9535254090053567, 13.905220700014478, 0.3836121869118286], "isController": false}, {"data": ["Delete Album-8", 290, 0, 0.0, 1712.5034482758624, 343, 8298, 1417.5, 3292.3000000000034, 3970.2999999999997, 6174.589999999968, 2.7703212617380424, 165.48497638062304, 0.4409788727180673], "isController": false}, {"data": ["CreateAlbum-9", 306, 0, 0.0, 1556.830065359477, 97, 9274, 1161.0, 3035.5, 3768.2999999999993, 7744.920000000005, 2.9049070144960556, 173.5242048143375, 0.4624021907840401], "isController": false}, {"data": ["CreateAlbum-8", 306, 0, 0.0, 1433.7222222222217, 100, 9604, 829.0, 3288.5000000000005, 4591.099999999998, 7233.060000000001, 2.905982905982906, 62.98252203525641, 0.456897702991453], "isController": false}, {"data": ["CreateAlbum-1", 306, 0, 0.0, 4.686274509803923, 1, 62, 3.0, 8.0, 14.0, 38.93000000000001, 3.1158992322261367, 4.768177829002301, 0.39557314471620875], "isController": false}, {"data": ["CreateAlbum-0", 306, 0, 0.0, 17.46405228758171, 2, 644, 5.0, 17.30000000000001, 43.54999999999984, 350.30000000000007, 3.1153916637820447, 14.67945779076989, 0.4015934566594042], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 40, 50.0, 0.4025764895330113], "isController": false}, {"data": ["Assertion failed", 40, 50.0, 0.4025764895330113], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9936, 80, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 40, "Assertion failed", 40, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Album", 290, 17, "Assertion failed", 17, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["CreateAlbum", 306, 23, "Assertion failed", 23, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Album-6", 290, 17, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 17, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["CreateAlbum-7", 306, 23, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 23, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
