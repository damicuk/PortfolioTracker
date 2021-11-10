/**
 * Creates the closed summary report if it doesn't already exist.
 * No data is writen to this sheet.
 * It contains formulas that pull data from other sheets.
 * @param {string} [sheetName] - The name of the sheet.
 */
AssetTracker.prototype.closedSummaryReport = function (sheetName = this.closedSummaryReportName) {

  const version = '1';

  let ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(sheetName);

  if (sheet) {
    if (this.getSheetVersion(sheet) === version) {
      return;
    }
    else {
      sheet.clear();
    }
  }
  else {
    sheet = ss.insertSheet(sheetName);
  }

  this.setSheetVersion(sheet, version);

  const referenceRangeName = this.closedPositionsRangeName;

  let headers = [
    [
      'Year',
      'Asset',
      'Asset Type',
      'Holding Period',
      'Balance',
      'Cost Price',
      'Sell Price',
      'Cost Basis',
      'Proceeds',
      'Realized P/L',
      'Realized P/L %'
    ]
  ];

  sheet.getRange('A1:K1').setValues(headers).setFontWeight('bold').setHorizontalAlignment("center");
  sheet.setFrozenRows(1);

  sheet.getRange('B2:D').setNumberFormat('@');
  sheet.getRange('E2:E').setNumberFormat('#,##0.00000000;(#,##0.00000000)');
  sheet.getRange('F2:G').setNumberFormat('#,##0.0000;(#,##0.0000)');
  sheet.getRange('H2:I').setNumberFormat('#,##0.00;(#,##0.00)');
  sheet.getRange('J2:J').setNumberFormat('[color50]#,##0.00_);[color3](#,##0.00);[blue]#,##0.00_)');
  sheet.getRange('K2:K').setNumberFormat('[color50]0% ▲;[color3]-0% ▼;[blue]0% ▬');

  sheet.clearConditionalFormatRules();
  this.addLongShortCondition(sheet, 'D3:D');

  const formula =
    `IF(ISBLANK(INDEX(${referenceRangeName}, 1, 1)),,{
QUERY({QUERY(${referenceRangeName}, "SELECT H, I, YEAR(L), S, V, W, X, Z")}, "SELECT 'TOTAL', ' ', '  ', '   ', '    ', '     ', '      ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) LABEL 'TOTAL' '', ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', '      ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", ""};
{"BY ASSET TYPE", "", "", "", "", "", "", "", "", "", ""};
QUERY({QUERY(${referenceRangeName}, "SELECT H, I, YEAR(L), S, V, W, X, Z")}, "SELECT ' ', '  ', Col2, '   ', '    ', '     ', '      ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col2 ORDER BY Col2 LABEL ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', '      ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", ""};
{"BY ASSET", "", "", "", "", "", "", "", "", "", ""};
QUERY({QUERY(${referenceRangeName}, "SELECT H, I, YEAR(L), S, V, W, X, Z")}, "SELECT ' ', Col1, Col2, '  ', SUM(Col4), SUM(Col5) / SUM(Col4), SUM(Col6) / SUM(Col4), SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col1, Col2 ORDER BY Col1, Col2 LABEL ' ' '', '  ' '', SUM(Col4) '', SUM(Col5) / SUM(Col4) '', SUM(Col6) / SUM(Col4) '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", ""};
{"BY YEAR", "", "", "", "", "", "", "", "", "", ""};
QUERY({QUERY(${referenceRangeName}, "SELECT H, I, YEAR(L), S, V, W, X, Z")}, "SELECT Col3, ' ', '  ', '   ', '    ', '     ', '      ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col3 ORDER BY Col3 LABEL Col3 '', ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', '      ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", ""};
{"BY YEAR AND ASSET TYPE", "", "", "", "", "", "", "", "", "", ""};
QUERY({QUERY(${referenceRangeName}, "SELECT H, I, YEAR(L), S, V, W, X, Z")}, "SELECT Col3, ' ', Col2, '  ', '   ', '    ', '     ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col2, Col3 ORDER BY Col3, Col2 LABEL Col3 '', ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", ""};
{"BY YEAR AND ASSET", "", "", "", "", "", "", "", "", "", ""};
QUERY({QUERY(${referenceRangeName}, "SELECT H, I, YEAR(L), S, V, W, X, Z")}, "SELECT Col3, Col1, Col2, ' ', SUM(Col4), SUM(Col5) / SUM(Col4), SUM(Col6) / SUM(Col4), SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col1, Col2, Col3 ORDER BY Col3, Col1, Col2 LABEL Col3 '', ' ' '', SUM(Col4) '', SUM(Col5) / SUM(Col4) '', SUM(Col6) / SUM(Col4) '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", ""};
{"BY HOLDING PERIOD", "", "", "", "", "", "", "", "", "", ""};
QUERY({QUERY(${referenceRangeName}, "SELECT H, I, YEAR(L), S, V, W, X, Z")}, "SELECT ' ', '  ', '   ', Col8, '    ', '     ', '      ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col8 ORDER BY Col8 LABEL ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', '      ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", ""};
{"BY ASSET TYPE AND HOLDING PERIOD", "", "", "", "", "", "", "", "", "", ""};
QUERY({QUERY(${referenceRangeName}, "SELECT H, I, YEAR(L), S, V, W, X, Z")}, "SELECT ' ', '  ', Col2, Col8, '   ', '    ', '     ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col2, Col8 ORDER BY Col2, Col8 LABEL ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", ""};
{"BY ASSET AND HOLDING PERIOD", "", "", "", "", "", "", "", "", "", ""};
QUERY({QUERY(${referenceRangeName}, "SELECT H, I, YEAR(L), S, V, W, X, Z")}, "SELECT ' ', Col1, Col2, Col8, SUM(Col4), SUM(Col5) / SUM(Col4), SUM(Col6) / SUM(Col4), SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col1, Col2, Col8 ORDER BY Col1, Col2, Col8 LABEL ' ' '', SUM(Col4) '', SUM(Col5) / SUM(Col4) '', SUM(Col6) / SUM(Col4) '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", ""};
{"BY YEAR AND HOLDING PERIOD", "", "", "", "", "", "", "", "", "", ""};
QUERY({QUERY(${referenceRangeName}, "SELECT H, I, YEAR(L), S, V, W, X, Z")}, "SELECT Col3, ' ', '  ', Col8, '   ', '    ', '     ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col3, Col8 ORDER BY Col3, Col8 LABEL Col3 '', ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", ""};
{"BY YEAR, ASSET TYPE AND HOLDING PERIOD", "", "", "", "", "", "", "", "", "", ""};
QUERY({QUERY(${referenceRangeName}, "SELECT H, I, YEAR(L), S, V, W, X, Z")}, "SELECT Col3, ' ', Col2, Col8, '  ', '   ', '    ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col2, Col3, Col8 ORDER BY Col3, Col2, Col8 LABEL Col3 '', ' ' '', '  ' '', '   ' '', '    ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", ""};
{"BY YEAR, ASSET AND HOLDING PERIOD", "", "", "", "", "", "", "", "", "", ""};
QUERY({QUERY(${referenceRangeName}, "SELECT H, I, YEAR(L), S, V, W, X, Z")}, "SELECT Col3, Col1, Col2, Col8, SUM(Col4), SUM(Col5) / SUM(Col4), SUM(Col6) / SUM(Col4), SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col1, Col2, Col3, Col8 ORDER BY Col3, Col1, Col2, Col8 LABEL Col3 '', SUM(Col4) '', SUM(Col5) / SUM(Col4) '', SUM(Col6) / SUM(Col4) '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''")
})`;

  sheet.getRange('A2').setFormula(formula);

  this.trimColumns(sheet, 18);

  let chartRange3 = ss.getRangeByName(this.chartRange3Name);
  let chartRange4 = ss.getRangeByName(this.chartRange4Name);
  let chartRange5 = ss.getRangeByName(this.chartRange5Name);

  let assetTypeProceedsPLChart = sheet.newChart().asColumnChart()
    .addRange(chartRange3)
    .setNumHeaders(1)
    .setTitle('Asset Type')
    .setPosition(1, 15, 30, 30)
    .build();

  sheet.insertChart(assetTypeProceedsPLChart);

  let assetProceedsPLChart = sheet.newChart().asColumnChart()
    .addRange(chartRange4)
    .setNumHeaders(1)
    .setTitle('Asset')
    .setPosition(21, 15, 30, 30)
    .build();

  sheet.insertChart(assetProceedsPLChart);

  let yearProceedsPLChart = sheet.newChart().asColumnChart()
    .addRange(chartRange5)
    .setNumHeaders(1)
    .setTitle('Year')
    .setPosition(40, 15, 30, 30)
    .build();

  sheet.insertChart(yearProceedsPLChart);

  sheet.autoResizeColumns(1, 11);
};