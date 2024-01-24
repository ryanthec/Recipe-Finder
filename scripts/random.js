

const randRecipeBtn = document.getElementById("randRecipeBtn");
const apiKey = "24fa938edd5e40ca9b93613bcf329966";
const recipeDisplay = document.getElementById("recipes");



randRecipeBtn.addEventListener("click", async function(event){
    event.preventDefault();

    try
    {
        recipeDisplay.innerHTML = "";
        const randomRecipe = await getRandRecipe();
        displayRandRecipe(randomRecipe);
    }
    catch(error)
    {
        console.log(error);
        window.alert(error);
    }
})


async function getRandRecipe()
{
    const myAPI = "https://api.spoonacular.com/recipes/random?apiKey=24fa938edd5e40ca9b93613bcf329966&number=1";
    const response = await fetch(myAPI);
    if(!response.ok)
    {
        throw new Error("Could not fetch recipe data");
    }
    return await response.json();
}

function displayRandRecipe(data)
{

    if (!data || !data.recipes || !data.recipes.length) 
    {
        console.error("No recipes found in the API response");
        return;
    }
    const recipe = data.recipes[0];

        const { title:name,
                image:imgURL,
                summary,
                extendedIngredients,
                analyzedInstructions
        } = recipe;

        const recipeDiv = document.createElement("div");
        const nameDisplay = document.createElement("h3");
        nameDisplay.textContent = name;
        recipeDiv.appendChild(nameDisplay);
        const imgDisplay = document.createElement("img");
        imgDisplay.src = imgURL;
        recipeDiv.appendChild(imgDisplay);
        

        if(Array.isArray(extendedIngredients) && extendedIngredients.length > 0)
        {
            const ingredientList = document.createElement("ul");

            extendedIngredients.forEach(ingredient =>{
                const ingredientItem = document.createElement("li");
                ingredientItem.textContent = `${ingredient.original}`
                ingredientList.appendChild(ingredientItem);
            });
            ingredientList.style.listStyleType = "none";
            recipeDiv.append(ingredientList);
        }

        if(Array.isArray(analyzedInstructions) && analyzedInstructions.length>0)
        {
            const showInstructionsBtn = document.createElement("button");
            showInstructionsBtn.textContent = "Click For Instructions ˅ ";
            showInstructionsBtn.classList.add("instructionsBtn");
            let instructionsDropdown;
            showInstructionsBtn.addEventListener("click", function(){

                if(instructionsDropdown)
                {
                    showInstructionsBtn.textContent = "Click For Instructions ˅"
                    recipeDiv.removeChild(instructionsDropdown);
                    instructionsDropdown = null;
                }
                else
                {
                    showInstructionsBtn.textContent = "Click For Instructions ˄"
                    instructionsDropdown = document.createElement("ul");
                    analyzedInstructions[0].steps.forEach(step =>{
                        const stepItem = document.createElement("li");
                        stepItem.textContent = `Step ${step.number}: ${step.step}`;
                        instructionsDropdown.appendChild(stepItem);
                    });
                    instructionsDropdown.classList.add("instructions");
                    recipeDiv.appendChild(instructionsDropdown);
                }
                
            });
            recipeDiv.appendChild(showInstructionsBtn);
        }

        recipeDiv.classList.add("recipeDivClass");
        recipeDisplay.appendChild(recipeDiv);
}
