/*!
 * stylesheet - v1.0.1
 * MIT License (c) 2015
 * https://github.com/codenameyau/stylesheet
 */
'use strict';


/********************************************************************
* STYLESHEET CONSTRUCTOR
*********************************************************************/
function StyleSheet() {
  this.style = document.createElement('style');
  document.head.appendChild(this.style);
  this.index = document.styleSheets.length - 1;
  this.sheet = document.styleSheets[this.index];
  this.selector = '';
  this.buffer = [];
  this.insertMethod = null;

  // Cross-browser compatability to insert rules.
  if('insertRule' in this.sheet) {
    this.insertMethod = this._insertRuleMethod;
  } else if('addRule' in this.sheet) {
    this.insertMethod = this._addRuleMethod;
  }
}


/********************************************************************
* STYLESHEET PUBLIC METHODS
*********************************************************************/
StyleSheet.prototype.setSelector = function(selector) {
  this.clearBuffer();
  this.selector = selector;
};

StyleSheet.prototype.insertRule = function(rule) {
  this.buffer.push(rule);
};

StyleSheet.prototype.applyRules = function() {
  var rules = this.buffer.join('; ');
  this.insertMethod(this.selector, rules);
  this.clearBuffer();
};

StyleSheet.prototype.clearBuffer = function() {
  this.buffer = [];
};

StyleSheet.prototype.enable = function() {
  this.sheet.disabled = false;
};

StyleSheet.prototype.disable = function() {
  this.sheet.disabled = true;
};


/********************************************************************
* STYLESHEET INTERNAL METHODS
*********************************************************************/
StyleSheet.prototype._insertRuleMethod = function(selector, rules) {
  this.sheet.insertRule(selector + '{' + rules + '}', 0);
};

StyleSheet.prototype._addRuleMethod = function(selector, rules) {
  this.sheet.addRule(selector, rules, 0);
};
