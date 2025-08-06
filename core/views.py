from django.shortcuts import render
from django.http import JsonResponse
from .services import generate_recipe_with_gemini

def index(request):
    """
    Renderiza a página inicial (RF-01).
    """
    return render(request, 'core/index.html')

def generate_recipe(request):
    """
    Recebe os ingredientes via POST, gera a receita (RF-02) 
    e retorna como JSON para ser exibida dinamicamente (RF-03).
    """
    if request.method == 'POST':
        ingredients = request.POST.get('ingredients')
        if not ingredients:
            return JsonResponse({'error': 'Por favor, insira os ingredientes.'}, status=400)

        # Chama o serviço de IA e desempacota o retorno
        success, message = generate_recipe_with_gemini(ingredients)
        
        if success:
            # Se a API retornou a receita com sucesso, retorna status 200
            return JsonResponse({'recipe': message})
        else:
            # Se a API retornou um erro, retorna status 500
            return JsonResponse({'error': message}, status=500)

    return JsonResponse({'error': 'Requisição inválida.'}, status=400)