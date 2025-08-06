document.addEventListener('DOMContentLoaded', function() {
    const ingredientForm = document.getElementById('ingredient-form');
    const generateButton = document.getElementById('generate-button');
    const buttonText = document.querySelector('.button-text');
    const spinner = document.querySelector('.spinner');

    const generatorSection = document.getElementById('generator-section');
    const recipeSection = document.getElementById('recipe-section');
    const recipeContent = document.getElementById('recipe-content');
    const backButton = document.getElementById('back-button');

    const historySection = document.getElementById('history-section');
    const showHistoryLink = document.getElementById('show-history-link');
    const historyList = document.getElementById('history-list');
    const backToGeneratorFromHistory = document.getElementById('back-to-generator-from-history');

    const RECIPE_HISTORY_KEY = 'recipeHistory';

    // RF-02 & RF-03: Submissão do formulário com AJAX
    ingredientForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Mostra o spinner e desabilita o botão
        buttonText.style.display = 'none';
        spinner.style.display = 'block';
        generateButton.disabled = true;

        const formData = new FormData(ingredientForm);

        fetch(ingredientForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.recipe) {
                // Formata o texto da IA para HTML (substituindo quebras de linha)
                const formattedRecipe = data.recipe
                    .replace(/\*\*(.*?)\*\*/g, '<h2>$1</h2>') // Nome do prato
                    .replace(/-\s(.*?)\n/g, '<li>$1</li>') // Itens de lista
                    .replace(/\n(\d+\.)/g, '<br><br>$1') // Passos de preparo
                    .replace(/\n/g, '<br>');

                recipeContent.innerHTML = formattedRecipe;
                
                // Salva no histórico (RF-04)
                saveRecipeToHistory(data.recipe);

                // Mostra a seção de receita e esconde a de geração
                generatorSection.classList.add('hidden');
                recipeSection.classList.remove('hidden');
            } else {
                alert(data.error || 'Ocorreu um erro.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Não foi possível se conectar ao servidor. Tente novamente.');
        })
        .finally(() => {
            // Esconde o spinner e reabilita o botão
            buttonText.style.display = 'block';
            spinner.style.display = 'none';
            generateButton.disabled = false;
        });
    });

    // RF-03: Botão para voltar
    backButton.addEventListener('click', () => {
        recipeSection.classList.add('hidden');
        generatorSection.classList.remove('hidden');
        ingredientForm.reset();
    });

    // RF-04: Lógica de Histórico
    function saveRecipeToHistory(recipeText) {
        let history = JSON.parse(localStorage.getItem(RECIPE_HISTORY_KEY)) || [];
        const dishName = recipeText.match(/\*\*Nome do Prato:\*\*\s*(.*)/)[1] || 'Receita Sem Título';
        
        // Adiciona a nova receita no início
        history.unshift({ name: dishName, content: recipeText });

        // Mantém apenas as últimas 10 receitas
        if (history.length > 10) {
            history.pop();
        }
        localStorage.setItem(RECIPE_HISTORY_KEY, JSON.stringify(history));
    }

    function loadHistory() {
        historyList.innerHTML = '';
        const history = JSON.parse(localStorage.getItem(RECIPE_HISTORY_KEY)) || [];
        if (history.length === 0) {
            historyList.innerHTML = '<p>Nenhuma receita gerada ainda.</p>';
            return;
        }

        history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.textContent = item.name;
            div.addEventListener('click', () => {
                // Reusa a lógica de formatação
                const formattedRecipe = item.content
                    .replace(/\*\*(.*?)\*\*/g, '<h2>$1</h2>')
                    .replace(/-\s(.*?)\n/g, '<li>$1</li>')
                    .replace(/\n(\d+\.)/g, '<br><br>$1')
                    .replace(/\n/g, '<br>');

                recipeContent.innerHTML = formattedRecipe;
                historySection.classList.add('hidden');
                recipeSection.classList.remove('hidden');
            });
            historyList.appendChild(div);
        });
    }

    // Eventos para mostrar/esconder o histórico
    showHistoryLink.addEventListener('click', (e) => {
        e.preventDefault();
        loadHistory();
        generatorSection.classList.add('hidden');
        recipeSection.classList.add('hidden');
        historySection.classList.remove('hidden');
    });

    backToGeneratorFromHistory.addEventListener('click', () => {
        historySection.classList.add('hidden');
        generatorSection.classList.remove('hidden');
    });
});