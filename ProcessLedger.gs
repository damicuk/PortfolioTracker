/**
 * Processes the ledger records.
 * It treats the ledger as a set of instuctions and simulates the actions specified.
 * Stops reading if it encounters the stop action.
 * @param {LedgerRecord[]} ledgerRecords - The collection of ledger records.
 */
AssetTracker.prototype.processLedger = function (ledgerRecords) {

  if (LedgerRecord.inReverseOrder(ledgerRecords)) {

    ledgerRecords = ledgerRecords.slice().reverse();
    let rowIndex = this.ledgerHeaderRows + ledgerRecords.length;
    for (let ledgerRecord of ledgerRecords) {
      if (ledgerRecord.action === 'Stop') {
        break;
      }
      this.processLedgerRecord(ledgerRecord, rowIndex--);
    }
  }
  else {
    let rowIndex = this.ledgerHeaderRows + 1;
    for (let ledgerRecord of ledgerRecords) {
      if (ledgerRecord.action === 'Stop') {
        break;
      }
      this.processLedgerRecord(ledgerRecord, rowIndex++);
    }
  }
};

/**
 * Processes a ledger record.
 * It treats the ledger record as an instuction and simulates the action specified.
 * @param {LedgerRecord} ledgerRecord - The ledger record to process.
 * @param {number} rowIndex - The index of the row in the ledger sheet used to set the current cell in case of an error.
 */
AssetTracker.prototype.processLedgerRecord = function (ledgerRecord, rowIndex) {

  let date = ledgerRecord.date;
  let action = ledgerRecord.action;
  let debitAsset = ledgerRecord.debitAsset;
  let debitExRate = ledgerRecord.debitExRate;
  let debitAmount = ledgerRecord.debitAmount;
  let debitFee = ledgerRecord.debitFee;
  let debitWalletName = ledgerRecord.debitWalletName;
  let creditAsset = ledgerRecord.creditAsset;
  let creditExRate = ledgerRecord.creditExRate;
  let creditAmount = ledgerRecord.creditAmount;
  let creditFee = ledgerRecord.creditFee;
  let creditWalletName = ledgerRecord.creditWalletName;
  let lotMatching = ledgerRecord.lotMatching;

  if (lotMatching) {
    this.lotMatching = lotMatching;
  }

  if (action === 'Transfer') {  //Transfer

    if (Currency.isFiat(debitAsset)) { //Fiat transfer

      if (debitWalletName) { //Fiat withdrawal

        this.getWallet(debitWalletName).getFiatAccount(debitAsset).transfer(-debitAmount).transfer(-debitFee);

      }
      else if (creditWalletName) { //Fiat deposit

        this.getWallet(creditWalletName).getFiatAccount(debitAsset).transfer(debitAmount).transfer(-debitFee);

      }
    }
    else if (Currency.isCrypto(debitAsset)) {  //Crypto transfer

      let lots = this.getWallet(debitWalletName).getAssetAccount(debitAsset).withdraw(debitAmount, debitFee, this.lotMatching, rowIndex);

      this.getWallet(creditWalletName).getAssetAccount(debitAsset).deposit(lots);

    }
  }
  else if (action === 'Trade') { //Trade

    if (Currency.isFiat(debitAsset) && Currency.isCrypto(creditAsset)) {  //Buy crypto

      this.getWallet(debitWalletName).getFiatAccount(debitAsset).transfer(-debitAmount).transfer(-debitFee);

      let lot = new Lot(date, debitAsset, debitExRate, debitAmount, debitFee, creditAsset, creditAmount, creditFee, debitWalletName);

      this.getWallet(debitWalletName).getAssetAccount(creditAsset).deposit(lot);

    }
    else if (Currency.isCrypto(debitAsset) && Currency.isFiat(creditAsset)) { //Sell crypto

      let lots = this.getWallet(debitWalletName).getAssetAccount(debitAsset).withdraw(debitAmount, debitFee, this.lotMatching, rowIndex);

      this.closeLots(lots, date, creditAsset, creditExRate, creditAmount, creditFee, debitWalletName);

      this.getWallet(debitWalletName).getFiatAccount(creditAsset).transfer(creditAmount).transfer(-creditFee);

    }
    else if (Currency.isCrypto(debitAsset) && Currency.isCrypto(creditAsset)) { //Exchange cyrptos

      let lots = this.getWallet(debitWalletName).getAssetAccount(debitAsset).withdraw(debitAmount, debitFee, this.lotMatching, rowIndex);

      this.closeLots(lots, date, creditAsset, creditExRate, creditAmount, creditFee, debitWalletName);

      let lot = new Lot(date, debitAsset, debitExRate, debitAmount, debitFee, creditAsset, creditAmount, creditFee, debitWalletName);

      this.getWallet(debitWalletName).getAssetAccount(creditAsset).deposit(lot);

    }
  }
  else if (action === 'Income') { //Income

    //the cost base is the value of (credit exchange rate x credit amount)
    let lot = new Lot(date, creditAsset, creditExRate, creditAmount, 0, creditAsset, creditAmount, 0, creditWalletName);

    this.getWallet(creditWalletName).getAssetAccount(creditAsset).deposit(lot);

    //keep track of income separately
    this.incomeLots.push(lot.duplicate());

  }
  else if (action === 'Donation') { //Donation

    let lots = this.getWallet(debitWalletName).getAssetAccount(debitAsset).withdraw(debitAmount, debitFee, this.lotMatching, rowIndex);

    this.donateLots(lots, date, debitExRate, debitWalletName);

  }
  else if (action === 'Gift') { //Gift

    this.getWallet(debitWalletName).getAssetAccount(debitAsset).withdraw(debitAmount, debitFee, this.lotMatching, rowIndex);

  }
  else if (action === 'Fee') { //Fee

    this.getWallet(debitWalletName).getAssetAccount(debitAsset).apportionFee(debitFee, rowIndex);

    let lots = this.getWallet(debitWalletName).getAssetAccount(debitAsset).removeZeroSubunitLots();

    this.closeLots(lots, date, this.accountingCurrency, 0, 0, 0, debitWalletName);

  }
};
