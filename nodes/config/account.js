module.exports = function(RED) {
  function AccountNode(config) {
    RED.nodes.createNode(this, config);
  }
  RED.nodes.registerType('account', AccountNode, {
    credentials: {
      email: { type: 'text' },
      password: { type: 'password' }
    }
  });
  AccountNode.prototype.getCredentialString = function() {
    var email = this.credentials.email;
    var password = this.credentials.password;
    return Buffer.from(email + ':' + password).toString('base64');
  };
};
