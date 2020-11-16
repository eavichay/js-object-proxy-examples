module.exports = function () {
    return {
      manipulateOptions: function manipulateOptions(opts, parserOpts) {
        console.log(parserOpts);
        parserOpts.plugins.push("jsx");
      }
    };
  };