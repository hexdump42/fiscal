'use strict';
/**
 * @file fiscal-dates.js - manage fiscal calendars
 * @author Mark J. Rees <mark.john.rees@gmail.com>
 * @version 0.1.0
 * @license MIT
 */

var moment = require('moment');

module.exports = Fiscal;

/**
 * Represents a fiscal calendar with 12 periods
 * @class Fiscal
 * @this {Fiscal}
 * @param {number} startMonth - the first month of the fiscal year. 1 = January, 2 = February etc.
 * @param {number} fiscalYear - the fiscal year as a 4 digit Number e.g. 2016.
 */
function Fiscal(startMonth, fiscalYear) {
  this.useForwardYear = (startMonth > 0);
  this.startMonth = (startMonth > 0) ? startMonth : startMonth * -1;
  this.lastMonth = (this.startMonth === 1) ? 12 : this.startMonth - 1;
  this.fiscalYear = fiscalYear;
  
}
 
/** 
 * @method getYear Returns the fiscal year for a date. 
 * For example, if Fiscal year end is set to June, 
 * the year for the date Janaury 2015 would be shown as FY 2015 
 * & the year for July 2015 would be FY 2016
 *
 * @memberof Fiscal
 * @param {string} date - Calendar date. Date should be in a format moment.js can parse e.g. 2016-01-16
 * @returns {number} Fiscal year
 */
Fiscal.prototype.getYear = function (date) {
  if (date === undefined) {
    return this.fiscalYear;
  }
  var d = moment(date);
  if (this.startMonth === 1) {
    return d.year();
  } else if (this.useForwardYear) {
    return (d.month() + 1 < this.startMonth) ? d.year() : d.year() + 1;
  } else {
    return (d.month() + 1 < this.startMonth) ? d.year() - 1 : d.year();
  }
};

/**
 * @method getPeriod Return fiscal period for calendar date.
 *
 * @memberof Fiscal
 * @param {string} date - Calendar date. Date should be in a format moment.js can parse.
 * @returns {number} period - fiscal period
 */
Fiscal.prototype.getPeriod = function (date) {
  var d = moment(date);
  if (d.month() + 1 >= this.startMonth) {
    return (d.month() + 1 - this.startMonth) + 1;
  } else {
    return d.month() + this.startMonth;
  }
};

/**
 * @method getPeriodMonth Return calendar month for fiscal period.
 * 
 * @memberof Fiscal
 * @param {number} period
 * @returns {number} calendar month
 */
Fiscal.prototype.getPeriodMonth = function (period) {
  if (period < this.startMonth) {
    return (this.startMonth + period) - 1;
  } else {
    return (period + 1) - this.startMonth;
  }
};

/**
 * @method getCalendarYearForPeriod
 * @memberof Fiscal
 * 
 * @param {number} period
 * @param {number} fiscal year
 * @returns {number} calendar year
 */
Fiscal.prototype.getCalendarYearForPeriod = function (period, year) {
  var month = this.getPeriodMonth(period);
  if (this.startMonth === 1) {
    return year || this.fiscalYear;
  } else if (this.useForwardYear) {
    return (month < this.startMonth) ? year : year - 1;
  } else {
    return (month < this.startMonth) ? year + 1: year;
  } 
};

/**
 * @method getPeriodDateRange
 * 
 * @memberof Fiscal
 * @param {number} period
 * @returns {object} date range for period.
 */
Fiscal.prototype.getPeriodDateRange = function (period) {
  
  var startDate = moment({ year: this.getCalendarYearForPeriod(period, this.fiscalYear), 
                           month: this.getPeriodMonth(period) - 1,
                           day: 1 });
  var endDate = moment(startDate).endOf('month');
  return { start: startDate, end: endDate };
};

/**
 * @method getYearDateRange
 * 
 * @memberof Fiscal
 * @returns {object} start and end date for current fiscal year.
 */
Fiscal.prototype.getYearDateRange = function () {
  var startDateRange = this.getPeriodDateRange(1);
  var endDateRange = this.getPeriodDateRange(12);

  return { start: startDateRange.start, end: endDateRange.end };
};