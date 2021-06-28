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

    var data = {"OkPercent": 99.91111111111111, "KoPercent": 0.08888888888888889};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.48355555555555557, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5488888888888889, 500, 1500, "Upadate Album-7"], "isController": false}, {"data": [0.0, 500, 1500, "Upadate Album-6"], "isController": false}, {"data": [0.7822222222222223, 500, 1500, "Upadate Album-8"], "isController": false}, {"data": [0.5888888888888889, 500, 1500, "Upadate Album-3"], "isController": false}, {"data": [0.17333333333333334, 500, 1500, "Upadate Album-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "Upadate Album-5"], "isController": false}, {"data": [0.9111111111111111, 500, 1500, "Upadate Album-4"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "Upadate Album-1"], "isController": false}, {"data": [0.6644444444444444, 500, 1500, "Upadate Album-0"], "isController": false}, {"data": [0.0, 500, 1500, "Upadate Album"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2250, 2, 0.08888888888888889, 3392.810222222214, 2, 27905, 821.5, 12111.200000000004, 18187.699999999997, 24114.229999999996, 72.74255601176813, 5241.572345502894, 20.15158235265591], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Upadate Album-7", 225, 0, 0.0, 740.8844444444444, 211, 1853, 633.0, 1179.0, 1366.6999999999998, 1776.100000000001, 16.98754246885617, 368.17873489996225, 2.6708929077010195], "isController": false}, {"data": ["Upadate Album-6", 225, 1, 0.4444444444444444, 6523.626666666667, 3431, 15424, 5447.0, 10296.400000000001, 12385.9, 13509.58, 12.755102040816327, 903.656351863662, 1.7485119047619047], "isController": false}, {"data": ["Upadate Album-8", 225, 0, 0.0, 539.2488888888892, 56, 2904, 456.0, 965.2, 1142.6999999999987, 2051.7400000000016, 18.13784764207981, 1083.4999118299074, 2.8871769195888755], "isController": false}, {"data": ["Upadate Album-3", 225, 0, 0.0, 1923.8933333333334, 5, 7083, 628.0, 6742.6, 6991.0, 7052.4400000000005, 29.714738510301107, 1116.7112129803882, 3.859433810419968], "isController": false}, {"data": ["Upadate Album-2", 225, 0, 0.0, 2423.186666666667, 492, 6389, 2195.0, 4497.8, 4782.199999999999, 6110.640000000003, 13.704470702887075, 2160.5810053180962, 2.2082399081800466], "isController": false}, {"data": ["Upadate Album-5", 225, 0, 0.0, 156.01777777777772, 2, 1359, 12.0, 542.8000000000002, 741.8, 1311.4600000000003, 30.620577027762657, 37.22911953082472, 3.827572128470332], "isController": false}, {"data": ["Upadate Album-4", 225, 0, 0.0, 219.85777777777778, 2, 1553, 20.0, 805.0, 1161.6, 1453.0200000000002, 29.78948762081292, 90.09574527505627, 3.7236859526016155], "isController": false}, {"data": ["Upadate Album-1", 225, 0, 0.0, 2178.6888888888884, 327, 7289, 1730.0, 3768.2000000000007, 5483.2999999999965, 6875.4400000000005, 16.41976209589141, 85.96322714460338, 4.313394534955849], "isController": false}, {"data": ["Upadate Album-0", 225, 0, 0.0, 889.3777777777773, 4, 4719, 310.0, 3315.0, 3870.8, 4620.200000000003, 20.06957452502007, 66.50006480800107, 2.5674943972437783], "isController": false}, {"data": ["Upadate Album", 225, 1, 0.4444444444444444, 18333.32000000001, 10833, 27905, 18176.0, 24111.8, 25058.9, 27154.320000000003, 7.274490785645004, 2620.8709055730683, 10.07611693743938], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, 50.0, 0.044444444444444446], "isController": false}, {"data": ["Assertion failed", 1, 50.0, 0.044444444444444446], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2250, 2, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "Assertion failed", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Upadate Album-6", 225, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Upadate Album", 225, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
