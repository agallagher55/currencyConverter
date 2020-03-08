const myEndpoint = 'https://free.currconv.com/api/v7/';
const key = 'c40de37da267595c9235';

console.log("Starting...")

const dropdownOne = document.querySelector('#curr1');
const dropdownTwo = document.querySelector('#curr2');
const resultsEl = document.querySelector('.resultText');
const convertInput = document.querySelector('input[name="amount"]')
const convertBtn = document.querySelector('button[name="convert"]');

// Get list of currencies for the input dropdown
async function getCurrencies(endpoint){
    const query = `apiKey=${key}`
    const response = await fetch(`${myEndpoint}currencies?${query}`);

    let data = await response.json();
    data = data.results;
    console.log(data)

    let currencyIDs = Object.values(data).map(
        function(x) {
            if(x["id"] != "ALL"){
                if(x["currencyName"]){
                    return `${x["id"]} - ${x["currencyName"]}`
                }
            } else {
                return ''
            }
        }).sort();
    currencyIDs = currencyIDs.map(x => `<option>${x}</option>`).join('');

    // Populate dropdowns
    dropdownOne.innerHTML = currencyIDs;
    dropdownTwo.innerHTML = currencyIDs;
};

async function convert(){
    console.log(`Converting function...`)
    resultsEl.textContent = "Loading..."

    const value1 = dropdownOne.value.split("-")[0].trim();
    const value2 = dropdownTwo.value.split("-")[0].trim();

    const conversionAmount = convertInput.value;
    console.log(`Need to convert ${conversionAmount} ${value1} to ${value2}`)

    // Get converted money symbol
    const symbResponse = await fetch(`${myEndpoint}currencies?apiKey=${key}`)
    let symbData = await symbResponse.json();
    symbData = symbData.results;
    console.log(symbData)
    const currSymbol = symbData[`${value2}`]['currencySymbol']
    const currName = symbData[`${value2}`]['currencyName']

    console.log(symbData)
    console.log(currSymbol)
    console.log(typeof currSymbol)

    
    // Run conversion with endpoint
    const query = `apiKey=${key}&q=${value1}_${value2}`;

    const response = await fetch(`${myEndpoint}convert?${query}`);
    let data = await response.json();
    data = data.results;
    console.log(data);

    const conversionFactor = data[`${value1}_${value2}`]['val'];
    const convertedAmt = (conversionFactor*parseFloat(conversionAmount)).toFixed(2);

    // Write Results
    if(currSymbol){
        resultsEl.textContent = `${currSymbol}${convertedAmt} ${currName}s`;
    }
    else{
        resultsEl.textContent = `${convertedAmt} ${currName}s`;
    }
    
}

// Populate drop-downs
getCurrencies(myEndpoint);
convertBtn.addEventListener('click', convert)


console.log("\nFinished.")
