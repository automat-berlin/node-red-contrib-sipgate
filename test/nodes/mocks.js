var res = {
  _res: {
    responseBody: "",
    set: function() { return this; },
    status: function() { return this; },
    send: function(body) { this.responseBody = body; return this; }
  }
};

module.exports = {
  res: res
};
