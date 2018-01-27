javascript: {
    var receipt_currency_visible = document.getElementById("N55:ReceiptCurrencyCode:0") != null;
    if (!receipt_currency_visible) {
        alert("Please click Show Receipt Currency and try again");
        exit();
    }

    var start_index = document.getElementById("N55:LineNumber:0").innerHTML;
    var end_index = document.getElementById("N55:LineNumber:9").innerHTML;
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "http://127.0.0.1:5000/expenses/"+start_index+"-"+end_index, false );
    xmlHttp.send();
    var response = JSON.parse(xmlHttp.response);
    var expenses = response["requested_transactions"];

    function formatDate(date) {
        var monthNames = [
          "Jan", "Feb", "Mar",
          "Apr", "May", "Jun", 
          "Jul", "Aug", "Sep",
          "Oct", "Nov", "Dec"
        ];
      
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
      
        return day + '-' + monthNames[monthIndex] + '-' + year;
    }

    function selectOption(selector, option) {
        for (j = 0; j < selector.length; j++) {
            if (selector[j].text.includes(option)) {
                selector.value = selector[j].value;
                return;
            }
        }
    }

    for (i = 0; i < expenses.length; i++) {
        var e = expenses[i];
        var date = formatDate(new Date(e['created']));
        var local_amount = e['local_amount'];
        var home_amount = e['amount'];        
        var amount = -1 * local_amount/100;
        var currency = e['local_currency'];
        var rate = home_amount / local_amount;
        var justification = e['notes'];

        document.getElementById("N55:Date:"+i).value = date;        
        document.getElementById("N55:ReceiptCurrencyAmount:"+i).value = amount;
        var currency_selector = document.getElementById("N55:ReceiptCurrencyCode:"+i);
        selectOption(currency_selector, currency);
        document.getElementById("N55:ExchangeRate:"+i).value = rate;
        var expense_type_selector = document.getElementById("N55:XxcfiExpenseTypesMex:"+i);
        var expense_details = justification.toLowerCase();     
        if (expense_details.includes("hotel")) {
            selectOption(expense_type_selector, "Hotel-Room");
        }else if (expense_details.includes("snack")){
            selectOption(expense_type_selector, "Lunch");            
        }else if (expense_details.includes("lunch")){
            selectOption(expense_type_selector, "Lunch");            
        }else if (expense_details.includes("breakfast")){
            selectOption(expense_type_selector, "Breakfast");            
        }else if (expense_details.includes("dinner")){
            selectOption(expense_type_selector, "Dinner");            
        }else if (expense_details.includes("train")){
            selectOption(expense_type_selector, "Rail");            
        }else if (expense_details.includes("taxi")){
            selectOption(expense_type_selector, "Taxi");            
        }else if (expense_details.includes("bus")){
            selectOption(expense_type_selector, "Bus");            
        }
        document.getElementById("N55:Justification:"+i).value = justification;        
    }

    var completed_count = end_index;
    var total_count = response["total_transactions"];

    if (completed_count > response["total_transactions"]) {
        completed_count = response["total_transactions"];
    }

    var remaining_count = total_count - completed_count;
    var message = "Now upload your receipts and you're done :)";

    if (remaining_count > 0) {
        message = remaining_count+(remaining_count==1?" expense ":" expenses ")+"remaining. Please Add More Lines.";
    }

    alert(completed_count+"/"+total_count+" expenses filled in. "+message);
};void(0);
