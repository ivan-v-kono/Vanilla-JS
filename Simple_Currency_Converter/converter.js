
var currencies = {};
var currency1, currency2;
var quantity;
var currencyVal1, currencyVal2;

var drop_downData = [{
        text: "BTC",
        value: 1,
        selected: true,
        description: "Bitcoin",
        imageSrc: "flags/btc-sm.png"
    },
    {
        text: "USD",
        value: 2,
        selected: false,
        description: "United States Dollar",
        imageSrc: "flags/us-sm.png"
    },
    {
        text: "GBP",
        value: 3,
        selected: false,
        description: "British Pound Sterling",
        imageSrc: "flags/uk-sm.png"
    },
    {
        text: "EUR",
        value: 4,
        selected: false,
        description: "Euro",
        imageSrc: "flags/eu-sm.png"
    }
];



$('#currency1').ddslick({
    data: drop_downData,
    width: 135,
    imagePosition: "left",
    background: "#FFF",
    onSelected: function(data) {
        currency1 = data.selectedData.text;
        currencyVal1 = data.selectedData.value - 1;
    }
});


$('#currency2').ddslick({
    data: drop_downData,
    width: 135,
    imagePosition: "left",
    background: "#FFF",
    onSelected: function(data) {
        currency2 = data.selectedData.text;
        currencyVal2 = data.selectedData.value - 1;
    }
});


$('#swap').on('click', function() {
    let quantity = document.getElementById("quantity").value;

    if (!isNaN(quantity) && +quantity > 0 && isFinite(quantity)) {

        let tmp = currencyVal1;
        currencyVal1 = currencyVal2;
        currencyVal2 = tmp;

        $('#currency1').ddslick('select', { index: currencyVal1 });
        $('#currency2').ddslick('select', { index: currencyVal2 });


        calcRecieved();
    
    } else {
        document.getElementById("status").innerHTML = 'Please enter the correct number';
        document.getElementById("quantity").value = '';
        document.getElementById("sum").innerHTML = '';
    }
});


function convert() {

    fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
        .then(response => response.json())
        .then(jsn => currenciesData(jsn));

    function currenciesData(jsn) {
        currencies = jsn;
        currencies.bpi.BTC = {};
        currencies.bpi.BTC.rate_float = 1;
        currencies.bpi.BTC.symbol = '&#579;';
        
        calcRecieved();
        document.getElementById("time").innerHTML = currencies.time.updated;
    }
    ;
}

function calcRecieved() {
    let q = document.getElementById("quantity").value;

    if (!isNaN(q) && +q > 0 && isFinite(q)) {
        let a = currencies.bpi[currency1].rate_float;
        let b = currencies.bpi[currency2].rate_float;
        let s = currencies.bpi[currency2].symbol;
        let amountRecieved = (+q * b / a);

        document.getElementById("status").innerHTML = "&#8194;";
        document.getElementById("sum").innerHTML = s + "&#8194;" + amountRecieved.toFixed(7);
    } else {
        document.getElementById("status").innerHTML = 'Please enter the correct number';
        document.getElementById("quantity").value = '';
        document.getElementById("sum").innerHTML = '';
    }
}