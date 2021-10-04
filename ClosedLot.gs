/**
 * Represents an amount of asset that has been sold or exchanged.
 * Calculations are done in integer amounts of subunits to avoid computational rounding errors.
 */
var ClosedLot = class ClosedLot {

  /**
   * Initializes the class with the properties set to the parameters.
   * @param {Lot} lot - An amount of asset purchased together.
   * @param {Date} date - The date of the sale or exchange.
   * @param {Asset} creditAsset - The asset credited.
   * @param {number} creditExRate - The credit asset to accounting currency exchange rate, 0 if the credit asset is the accounting currency.
   * @param {number} creditAmount - The amount of asset credited.
   * @param {number} creditFee - The fee in asset units credited.
   * @param {string} walletName - The name of the wallet (or exchange) in which the transaction took place.
   */
  constructor(lot, date, creditAsset, creditExRate, creditAmount, creditFee, walletName) {

    /**
     * An amount of asset purchased together.
     * @type {Lot}
     */
    this.lot = lot;

    /**
     * The date of the sale or exchange.
     * @type {Date}
     */
    this.date = date;

    /**
     * The asset credited.
     * @type {Asset}
     */
    this.creditAsset = creditAsset;

    /**
     * The credit asset to accounting currency exchange rate, 0 if the credit asset is the accounting currency.
     * @type {number}
     */
    this.creditExRate = creditExRate;

    /**
     * The amount of asset subunits credited.
     * @type {number}
     */
    this.creditAmountSubunits = Math.round(creditAmount * this.creditAsset.subunits);

    /**
     * The fee in asset subunits credited.
     * @type {number}
     */
    this.creditFeeSubunits = Math.round(creditFee * this.creditAsset.subunits);

    /**
     * The name of the wallet (or exchange) in which the transaction took place.
     * @type {string}
     */
    this.walletName = walletName;

  }

  /**
   * The amount of asset credited.
   * @type {number}
   */
  get creditAmount() {

    return this.creditAmountSubunits / this.creditAsset.subunits;
  }

  /**
   * The fee in asset units credited.
   * @type {number}
   */
  get creditFee() {

    return this.creditFeeSubunits / this.creditAsset.subunits;
  }
};