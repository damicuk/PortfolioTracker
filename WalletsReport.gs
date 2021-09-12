/**
 * Creates the wallets report if it doesn't already exist.
 * No data is writen to this sheet.
 * It contains formulas that pull data from other sheets.
 */
AssetTracker.prototype.walletsReport = function () {

  const sheetName = this.walletsReportName;

  let ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(sheetName);

  if (sheet) {

    return;

  }

  sheet = ss.insertSheet(sheetName);

  const referenceRangeName1 = this.openPositionsRangeName;
  const referenceRangeName2 = this.fiatAccountsRangeName;

  sheet.getRange('A1:2').setFontWeight('bold').setHorizontalAlignment("center");
  sheet.setFrozenRows(2);
  sheet.setFrozenColumns(1);

  sheet.getRange('A2:B').setNumberFormat('@');
  sheet.getRange(2, 2, sheet.getMaxRows(), sheet.getMaxColumns()).setNumberFormat('#,##0.00000000;(#,##0.00000000);');

  sheet.getRange('A1').setFormula(
    `IF(AND(ISBLANK(INDEX(${referenceRangeName1}, 1, 1)), COUNT(QUERY(${referenceRangeName2}, "SELECT C"))=0),,
TRANSPOSE(QUERY(
IF(COUNT(QUERY(${referenceRangeName2}, "SELECT C"))=0,
QUERY(${referenceRangeName1}, "SELECT H, I, L, SUM(M) GROUP BY H, I, L ORDER BY I, H, L LABEL SUM(M) ''"),
IF(ISBLANK(INDEX(${referenceRangeName1}, 1, 1)),
QUERY(QUERY(${referenceRangeName2}, "SELECT B, ' ', A, SUM(C) GROUP BY B, A ORDER BY B, A LABEL ' ' '', SUM(C) ''"), "SELECT * WHERE Col4 <> 0"),
{
QUERY(${referenceRangeName1}, "SELECT H, I, L, SUM(M) GROUP BY H, I, L ORDER BY I, H, L LABEL SUM(M) ''");
QUERY(QUERY(${referenceRangeName2}, "SELECT B, ' ', A, SUM(C) GROUP BY B, A ORDER BY B, A LABEL ' ' '', SUM(C) ''"), "SELECT * WHERE Col4 <> 0")
})), "SELECT Col1, Col2, SUM(Col4) GROUP BY Col1, Col2 PIVOT Col3 ORDER BY Col2, Col1 LABEL Col1 'Wallet'")))`
  );

  sheet.autoResizeColumns(1, sheet.getMaxColumns());
};