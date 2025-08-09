import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

MODEL_NAME = 'gemini-1.5-flash' 

def generate_recipe_with_gemini(ingredients: str):
    """
    Envia a lista de ingredientes para a API do Gemini e retorna uma tupla:
    (sucesso: bool, mensagem: str)
    """
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        
        prompt = f"""
        Você é um chef de cozinha criativo e experiente. Sua tarefa é criar uma receita deliciosa e fácil de seguir usando apenas os ingredientes fornecidos.

        Ingredientes disponíveis: {ingredients}

        Por favor, gere uma resposta no seguinte formato, sem textos adicionais antes ou depois:

        **Nome do Prato:** [Nome criativo e descritivo para o prato]

        **Ingredientes:**
        - [Quantidade] de [ingrediente 1]
        - [Quantidade] de [ingrediente 2]
        - ... (liste todos os ingredientes, incluindo temperos básicos como sal e pimenta, se fizer sentido)

        **Modo de Preparo:**
        1. [Primeiro passo claro e conciso]
        2. [Segundo passo]
        3. [Continue com todos os passos necessários]

        Se os ingredientes forem insuficientes para criar uma receita, por favor, responda apenas: "Os ingredientes fornecidos são insuficientes para criar uma receita."
        """

        response = model.generate_content(prompt)
        
        return True, response.text

    except Exception as e:
        print(f"Erro ao gerar receita: {e}")
        return False, "Ocorreu um erro ao tentar gerar sua receita. Por favor, tente novamente."