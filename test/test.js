'use strict';
/**
 * Test Fiscal 
 */
var assert = require('assert');
var moment = require('moment');
var Fiscal = require('../lib/index.js');

describe('Fiscal', function () {
  describe('create', function () {
    it('should have a startMonth & fiscalYear properties', function () {
      var fiscal = new Fiscal(7, 2017);
      assert.equal(fiscal.startMonth, 7);
      assert.equal(fiscal.fiscalYear, 2017);       
    });
    it('should have a useForwardYear property set to true if startMonth value postive', 
    function () {
      var fiscal = new Fiscal(7, 2017);
      assert.equal(fiscal.useForwardYear, true);       
    });
    it('should have a useForwardYear property set to false if startMonth value negative', 
    function () {
      var fiscal = new Fiscal(-7, 2017);
      assert.equal(fiscal.useForwardYear, false);       
    });
  });
  describe('getCalendarYearForPeriod', function () {
    it('should return the calendar year for the period and fiscal year arguments when useForwardCalendar is true',
    function () {
      var fiscal1 = new Fiscal(1, 2016);
      assert.equal(fiscal1.getCalendarYearForPeriod(7, 2016), 2016);
      var fiscal7 = new Fiscal(7, 2017);
      assert.equal(fiscal7.getCalendarYearForPeriod(1, 2017), 2016);
      assert.equal(fiscal7.getCalendarYearForPeriod(6, 2017), 2016);
      assert.equal(fiscal7.getCalendarYearForPeriod(7, 2017), 2017);
      assert.equal(fiscal7.getCalendarYearForPeriod(12, 2017), 2017);
    });
    it('should return the calendar year for the period and fiscal year arguments when useForwardCalendar is false',
    function () {
      var fiscal1 = new Fiscal(-1, 2016);
      assert.equal(fiscal1.getCalendarYearForPeriod(7, 2016), 2016);
      var fiscal7 = new Fiscal(-7, 2017);
      assert.equal(fiscal7.getCalendarYearForPeriod(1, 2016), 2016);
      assert.equal(fiscal7.getCalendarYearForPeriod(6, 2016), 2016);
      assert.equal(fiscal7.getCalendarYearForPeriod(7, 2016), 2017);
      assert.equal(fiscal7.getCalendarYearForPeriod(12, 2016), 2017);
    });
  });
  describe('getYear', function () {
    it('should return the instance creation fiscal year if no date argument', 
    function () {
      var fiscal = new Fiscal(7, 2017);
      assert.equal(fiscal.getYear(), 2017);
    });
    it('should return the fiscal year = year of the date argument when start month is january', 
    function () {
      var fiscal = new Fiscal(1, 2017);
      assert.equal(fiscal.getYear('2017-01-01'), 2017);
      assert.equal(fiscal.getYear('2016-01-01'), 2016);
    });
    it('should return the correct fiscal year for the date argument when useForwardYear is true', 
    function () {
      var fiscal = new Fiscal(7, 2017);
      assert.equal(fiscal.getYear('2016-07-01'), 2017);
      assert.equal(fiscal.getYear('2016-08-01'), 2017);
      assert.equal(fiscal.getYear('2016-06-01'), 2016);
      assert.equal(fiscal.getYear('2016-01-01'), 2016);
      assert.equal(fiscal.getYear('2015-07-01'), 2016);
    });
    it('should return the correct fiscal year for the date argument when useForwardYear is false', 
    function () {
      var fiscal = new Fiscal(-7, 2017);
      assert.equal(fiscal.getYear('2016-07-01'), 2016);
      assert.equal(fiscal.getYear('2016-08-01'), 2016);
      assert.equal(fiscal.getYear('2016-06-01'), 2015);
      assert.equal(fiscal.getYear('2016-01-01'), 2015);
      assert.equal(fiscal.getYear('2015-07-01'), 2015);
    });
  });
  describe('getPeriod', function () {
    it('should return the fiscal period for the date argument', 
    function () {
      var fiscal = new Fiscal(1, 2016);
      assert.equal(fiscal.getPeriod('2016-01-01'), 1);
      assert.equal(fiscal.getPeriod('2016-12-01'), 12);
      var fiscal7 = new Fiscal(7, 2017);
      assert.equal(fiscal7.getPeriod('2016-07-01'), 1);
      assert.equal(fiscal7.getPeriod('2016-12-01'), 6);
      assert.equal(fiscal7.getPeriod('2017-01-01'), 7);
      assert.equal(fiscal7.getPeriod('2017-06-01'), 12);
    });
  });
  describe('getPeriodMonth', function () {
    it('should return the calendar month for a fiscal period',
    function () {
      var fiscal = new Fiscal(7, 2017);
      assert.equal(fiscal.getPeriodMonth(1), 7);
      assert.equal(fiscal.getPeriodMonth(6), 12);
      assert.equal(fiscal.getPeriodMonth(7), 1);
      assert.equal(fiscal.getPeriodMonth(12), 6);
      var fiscal1 = new Fiscal(1, 2016);
      assert.equal(fiscal1.getPeriodMonth(1), 1);
      assert.equal(fiscal1.getPeriodMonth(6), 6);
      assert.equal(fiscal1.getPeriodMonth(12), 12);
    });
  });
  describe('getPeriodDateRange', function () {
    it('should return the start and end dates for specified fiscal period within instance fiscal year',
    function () {
      var fiscal = new Fiscal(7, 2017);
      assert.equal(fiscal.getPeriodDateRange(7).start.toString(), 
                   moment('2017-01-01').toString());
      assert.equal(fiscal.getPeriodDateRange(7).end.toString(), 
                   moment('2017-01-31 23:59:59').toString());
      var fiscal1 = new Fiscal(1, 2016);
      assert.equal(fiscal1.getPeriodDateRange(1).start.toString(), 
                   moment('2016-01-01').toString());
      assert.equal(fiscal1.getPeriodDateRange(1).end.toString(), 
                   moment('2016-01-31 23:59:59').toString());
    });
  });
  describe('getYearDateRange', function () {
    it('should return the start and end dates for instance fiscal year',
    function () {
      var fiscal = new Fiscal(7, 2017);
      assert.equal(fiscal.getYearDateRange().start.toString(), 
                   moment('2016-07-01').toString());
      assert.equal(fiscal.getYearDateRange().end.toString(), 
                   moment('2017-06-30 23:59:59').toString());
      var fiscal1 = new Fiscal(1, 2016);
      assert.equal(fiscal1.getYearDateRange(1).start.toString(), 
                   moment('2016-01-01').toString());
      assert.equal(fiscal1.getYearDateRange(1).end.toString(), 
                   moment('2016-12-31 23:59:59').toString());
    });
  });
});