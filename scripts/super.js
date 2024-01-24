
const myInput = document.getElementById("myInput");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const filterList = document.getElementById("filterList");
const recipeBtn = document.getElementById("recipeBtn");
const apiKey = "24fa938edd5e40ca9b93613bcf329966";
const recipeDisplay = document.getElementById("recipes");
let filterNum = 0;


const myMainInput = document.getElementById("myMainInput");
const mainSubmitBtn = document.getElementById("mainSubmitBtn");
const mainIngredient = document.getElementById("mainIngredient");
const mainResetBtn = document.getElementById("mainResetBtn");
let mainSelected = "";

mainSubmitBtn.addEventListener("click", function(event){
    if(!mainSelected)
    {
        let mainUserInput = myMainInput.value;
        mainIngredient.textContent += `${mainUserInput}`;
        mainSelected = mainUserInput;
        myMainInput.value = "";
    }
    else
    {
        window.alert("You have already selected a main ingredient");
    }
    
});

mainResetBtn.addEventListener("click", function(event){
    if(mainSelected)
    {
        mainIngredient.textContent = "Main Ingredient: ";
        myMainInput.value="";
        mainSelected = "";
    }
})


submitBtn.addEventListener("click", function(event){
    let userInput = myInput.value;
    addFilter(userInput);
    myInput.value = "";
});

resetBtn.addEventListener("click",function(event){
    resetFilters();
})


function addFilter(userInput){

    if(userInput.trim() === "")
    {
        window.alert("Enter a valid ingredient");
    }
    else
    {
        let newFilter = document.createElement("li");
        let newBtn = document.createElement("button");
        newBtn.textContent = "✖";
        newBtn.classList.add("filterBtns");
        newBtn.addEventListener("click", function(){
            newFilter.parentNode.removeChild(newFilter);
            filterNum--;
        });
        newFilter.classList.add("filterItem");
        let newText = document.createElement("span");
        newText.textContent = userInput.toLowerCase();
        newFilter.appendChild(newText);
        newFilter.appendChild(newBtn);
        filterList.appendChild(newFilter);
        filterNum++;
    }
}
function resetFilters()
{
    while(filterList.firstChild)
    {
        filterList.removeChild(filterList.firstChild);
    }
    filterNum = 0;
}




recipeBtn.addEventListener("click", async function(event)
{
    event.preventDefault();

    if(mainSelected)
    {
        try
        {
            recipeDisplay.innerHTML = "";
            const recipeIds = await getRecipeData(filterList);
            const detailedRecipes = await getRecipeIDs(recipeIds);
            displayRecipeInfo(detailedRecipes);
        }
        catch(error)
        {
            console.log(error);
            window.alert(error);
        }
    }
    else
    {
        window.alert("Please enter a main ingredient");
    }
});


async function getRecipeData(filterList)
{

    let elements = filterList.querySelectorAll("li span");
    let filters = "";
    for(let i=0;i<elements.length;i++)
    {
        {
            filters += `, ${elements[i].textContent}`;
        }
    }
    filters = filters.slice(2);
    
    const apiURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=24fa938edd5e40ca9b93613bcf329966&query=${mainSelected}&excludeIngredients=${filters}&number =2`;
    const response = await fetch(apiURL);

    if(!response.ok)
    {
        throw new Error("Could not fetch recipe data");
    }

    const responseData = await response.json();
    const recipeIds = responseData.results.map(recipe => recipe.id);

    return recipeIds;

}

async function getRecipeIDs(recipeIds)
{
    const detailedRecipes = [];

    for(const recipeId of recipeIds)
    {
        const apiURL2 = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=24fa938edd5e40ca9b93613bcf329966`;
    
        try{
            const response2 = await fetch(apiURL2);
            if(!response2.ok)
            {
                throw new Error("Could not fetch recipe data");
            }

            const detailedRecipe = await response2.json();
            detailedRecipes.push(detailedRecipe);
        }
        catch(error)
        {
            console.error(error);
        }
    }
    return detailedRecipes;   
}



function displayRecipeInfo(detailedRecipes)
{
    detailedRecipes.forEach(recipe => {
        const {title: name,
                image: imgURL,
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

        if(extendedIngredients.length > 0)
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


        if(analyzedInstructions && analyzedInstructions.length>0)
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
    });

}