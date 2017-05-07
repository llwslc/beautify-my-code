
module.exports = {

  config: require('./config'),

  activate: function (state)
  {
    atom.commands.add("atom-workspace", "beautify-my-code:format", () => this.format());
  },

  format: function ()
  {
  },
}
