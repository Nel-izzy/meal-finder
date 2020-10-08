const submit = document.getElementById("submit");
const search = document.getElementById("search");
const randomBtn = document.getElementById("random");
const resultHeading = document.getElementById("result-heading");
const mealsEl = document.getElementById("meals");
const singleMeal = document.getElementById("single-meal");

function clearDom() {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";
  singleMeal.innerHTML = "";
}
function getMealByName(e) {
  e.preventDefault();
  clearDom();
  let term = search.value;
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        if (data.meals === null) {
          resultHeading.innerHTML = `<h2>No result for '${term}'</h2>`;
        } else {
          resultHeading.innerHTML = `<h2>Search results for '${term}'</h2>`;
          meals.innerHTML = data.meals
            .map(
              (meal) => `
                <div class="meal">
                <img src= "${meal.strMealThumb}" alt= ${meal.strMeal}/>
                <div class="meal-info" data-mealID= ${meal.idMeal}>
                <h3>${meal.strMeal}</h3>
                </div>
                </div>
                `
            )
            .join("");
        }
      })
      .catch((error) => console.log(error));
    search.value = " ";
  } else {
    alert("Please enter a search term");
  }
}

function addMealToDom(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  singleMeal.innerHTML = `
           <div class="single-meal">
           <h1>${meal.strMeal}</h1>
           <img src="${meal.strMealThumb}" alt=${meal.strMeal}/>
               <div class="single-meal-info">
               ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
               ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
               </div>
               <div class="main">
               <p>${meal.strInstructions}</p>
               <h3>Ingredients</h3>
               <ul>
               ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
               </ul>
               </div>
           </div> 
`;
}

function getMealById(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.meals[0]);
      const meal = data.meals[0];
      addMealToDom(meal);
    });
}

function getRandomMeal() {
  clearDom();
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((res) => res.json())
    .then((data) => {
      addMealToDom(data.meals[0]);
    });
}

submit.addEventListener("submit", getMealByName);
randomBtn.addEventListener("click", getRandomMeal);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    // console.log(item);
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealId = mealInfo.getAttribute("data-mealid");
    getMealById(mealId);
  }
});
