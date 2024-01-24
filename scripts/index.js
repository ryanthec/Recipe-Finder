
const myInput = document.getElementById("myInput");
const submitBtn = document.getElementById("submitBtn");
const filterList = document.getElementById("filterList");
const recipeBtn = document.getElementById("recipeBtn");
const apiKey = "24fa938edd5e40ca9b93613bcf329966";
const recipeDisplay = document.getElementById("recipes");

let filterNum = 0;

submitBtn.addEventListener("click", function(event){
    let userInput = myInput.value;
    addFilter(userInput);
    myInput.value = "";
});

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

recipeBtn.addEventListener("click", async function(event)
{
    event.preventDefault();

    if(filterNum>0)
    {
        try
        {
            recipeDisplay.innerHTML = "";
            const recipeData = await getRecipeData(filterList);
            displayRecipeInfo(recipeData);
        }
        catch(error)
        {
            console.log(error);
            window.alert(error);
        }
    }
    else
    {
        window.alert("Please enter a ingredient");
    }

    
});


async function getRecipeData(filterList)
{
    let elements = filterList.querySelectorAll("li span");
    let filters = "";
    for(let i=0;i<elements.length;i++)
    {
        {
            filters += `,${elements[i].textContent}`;
        }
    }
    filters = filters.slice(1);
    
    const apiURL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=24fa938edd5e40ca9b93613bcf329966&ingredients=${filters}&number=3&ranking=1`
    const response = await fetch(apiURL);

    if(!response.ok)
    {
        throw new Error("Could not fetch recipe data");
    }
    return await response.json();
}

function displayRecipeInfo(data)
{
    data.forEach(recipe => {
        const {title: name,
                image: imgURL,
                usedIngredientCount,
                missedIngredientCount,
                missedIngredients,
                usedIngredients
        } = recipe;

        const recipeDiv = document.createElement("div");

        const nameDisplay = document.createElement("h3");
        nameDisplay.textContent = name;
        recipeDiv.appendChild(nameDisplay);
        const imgDisplay = document.createElement("img");
        imgDisplay.src = imgURL;
        imgDisplay.classList.add("recipeImg");
        recipeDiv.appendChild(imgDisplay);

        if(usedIngredientCount + missedIngredientCount > 0)
        {
            const usedIngredientsList = document.createElement("ul");
            const missedIngredientsList = document.createElement("ul");


            usedIngredients.forEach(ingredient =>{
                const ingredientItem = document.createElement("li");
                ingredientItem.textContent = `${ingredient.original}`
                recipeDiv.appendChild(ingredientItem);
            });


            missedIngredients.forEach(ingredient =>{
                const ingredientItem = document.createElement("li");
                ingredientItem.textContent = `${ingredient.original}`
                recipeDiv.appendChild(ingredientItem);
            });
        }
        recipeDiv.classList.add("recipeDivClass");
        recipeDisplay.appendChild(recipeDiv);
    });

}