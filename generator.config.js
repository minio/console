module.exports = {
  hooks: {
    onInsertPathParam: (paramName) => `encodeURIComponent(${paramName})`,
  },
};
