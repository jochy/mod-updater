const axios = require("axios");
const en = require('./src/i18n/en.json');
const FormData = require('form-data');
const fs = require('fs');

main();

async function main() {
    const translations = ['es', 'it', 'de', 'pt', 'pl', 'sv'];
    for (let target of translations) {
        await translateToLang(en, target);
    }
}

async function translateToLang(toTranslate, target) {
    console.log('Translating into ' + target);
    const start = performance.now();
    let translated = await translate(toTranslate, target);
    fs.writeFileSync("./src/i18n/" + target + ".json", JSON.stringify(translated, null, 4));
    console.log('    Translated to ' + target + ' done in ' + Math.round((performance.now() - start) / 1000) + ' s');
}

async function translate(toTranslate, target) {
    let result = {};
    for (let key of Object.keys(toTranslate)) {
        let v = toTranslate[key];
        if (typeof v === "object") {
            result[key] = await translate(v, target);
        } else {
            result[key] = await requestTranslate(v, target);
        }
    }
    return result;
}

async function requestTranslate(text, target) {
    let body = new FormData();
    body.append("q", text);
    body.append("source", "en");
    body.append("target", target);
    body.append("format", "html");

    let res = await axios.post("https://lt.vern.cc/translate", body, {
        headers: {
            Accept: "application/json"
        }
    });

    return res.data.translatedText;
}