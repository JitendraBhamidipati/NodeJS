const fs = require("fs");
const prompt = require("prompt");

const createWidget = (widgetName, isReduxForm) => {
  const widgetNameArray = widgetName.split(" ");
  let camelCaseWidgetName;
  widgetNameArray.forEach((word, index) => {
    if (index === 0) {
      camelCaseWidgetName = word.replace(word[0], word[0].toLowerCase());
    } else {
      camelCaseWidgetName += word.replace(word[0], word[0].toUpperCase());
    }
  });
  const helpersPath = `./${widgetName}/_helpers`;
  const actionsPath = `./${widgetName}/actions`;
  const appPath = `./${widgetName}/components/App`;
  const reducersPath = `./${widgetName}/reducer`;

  fs.mkdir(helpersPath, { recursive: true }, () => {
    fs.writeFileSync(`${helpersPath}/constants.js`, "testing");
  });
  fs.mkdir(actionsPath, { recursive: true }, () => {
    fs.writeFileSync(
      `${actionsPath}/${camelCaseWidgetName}Actions.js`,
      "testing"
    );
  });
  fs.mkdir(appPath, { recursive: true }, () => {
    fs.writeFileSync(`${appPath}/index.js`, "testing");
    fs.writeFileSync(`${appPath}/component.jsx`, "testing");
  });
  fs.mkdir(reducersPath, { recursive: true }, () => {
    fs.writeFileSync(
      `${reducersPath}/${camelCaseWidgetName}Reducer.js`,
      "testing"
    );
  });
};

const schema = {
  properties: {
    widgetName: {
      pattern: /^[a-zA-Z\s]+$/,
      message: "Name must be only letters or  spaces",
      required: true,
    },
    "reduxForm(y/n)": {
      pattern: /^[y|n|Y|N]{1}$/,
      message: "value must be y or n",
      required: true,
    },
  },
};

prompt.start();

prompt.get(schema, (err, result) => {
  if (err) return onErr(err);
  createWidget(result.widgetName, result["reduxForm(y/n)"]);
});

function onErr(err) {
  console.log(err);
  return 1;
}
