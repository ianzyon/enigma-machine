// estrutura de aplicativos js puro
// adicionar os Event Listeners (clicks, mousovers, etc)
// escrever as funções

// Listen for submit
document.getElementById('loan-form').addEventListener('submit', function(e){
    e.preventDefault();
    // hide results
    document.getElementById('results').style.display = 'none';
    //show loader
    document.getElementById('loading').style.display = 'block';

    setTimeout(calculateResults,1000);
});

// Calculate Results
function calculateResults(){
    
    //console.log('Calculating..');

    // ui vars
    const amount = document.getElementById('amount'); 
    const interest = document.getElementById('interest'); 
    const years = document.getElementById('years');
    const monthlyPayment = document.getElementById('monthly-payment');
    const totalPayment = document.getElementById('total-payment'); 
    const totalInterest = document.getElementById('total-interest'); 
    
    const principal = parseFloat(amount.value);
    const calculatedInterest = parseFloat(interest.value) / 100 / 12;
    const calculatedPayments = parseFloat(years.value) * 12;
    // Compute monthly payments
    
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);

    if(isFinite(monthly)){
        monthlyPayment.value = monthly.toFixed(2);
        totalPayment.value = (monthly * calculatedPayments).toFixed(2);
        totalInterest.value = ((monthly * calculatedPayments) - principal).toFixed(2);
        document.getElementById('results').style.display = 'block';
        document.getElementById('loading').style.display = 'none';
    } else { // error
        showError('Error! Check your numbers, please.');
    }
}

    function showError(error) {
        // cria o div
        const errorDiv = document.createElement('div');
        // Mostrar elementos
        const card = document.querySelector('.card');
        const heading = document.querySelector('.heading');

        // configura a classe do div
        errorDiv.className = 'alert alert-danger';
        // insere um nodo de texto e adiciona ao div
        errorDiv.appendChild(document.createTextNode(error));
        // insere o erro acima do heading
        card.insertBefore(errorDiv, heading); // conteudo, alvo
        // Clear error in 3 secs
        setTimeout(clearError,2000);

    }
    function clearError(){
        document.getElementById('loading').style.display = 'none';
        document.querySelector('.alert').remove();
        
    }
