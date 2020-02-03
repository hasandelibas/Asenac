tsc
echo "" > js/asenac.browser.function.min.js 
cat js/delibas.js >> js/asenac.browser.function.min.js
cat js/Asenac.js >> js/asenac.browser.function.min.js
cat js/JsonAsenac.js >> js/asenac.browser.function.min.js
cat js/Browser.View.js >> js/asenac.browser.function.min.js
echo "exports.Asenac=Asenac" >> js/asenac.browser.function.min.js