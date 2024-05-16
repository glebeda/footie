module.exports = {
    reporters: [
      "default",
      ["jest-ctrf-reporter", {
        "outputFile": "ctrf/ctrf-report.json"
      }]
    ]
  };
  