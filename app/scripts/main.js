
const { Component, PropTypes } =React;
const { createStore, combineReducers, applyMiddleware, bindActionCreators } = Redux;
const { Provider, connect } = ReactRedux;
// constants
const types = {
  ADD_RECIPE: 'ADD_RECIPE',
  DELETE_RECIPE: 'DELETE_RECIPE',
  EDIT_RECIPE: 'EDIT_RECIPE',
  UPDATE_RECIPE: 'UPDATE_RECIPE'

}

// action creaters
const RecipeActions = {
  addRecipe: function addRecipe(name, ingredients) {
    return {
      type: types.ADD_RECIPE,
      name,
      ingredients
    }
  },

  deleteRecipe: function deleteRecipe(id) {
    return {
      type: types.DELETE_RECIPE,
      id
    }
  },

  editRecipe: function editRecipe(id, name, ingredients) {
    return {
      type: types.EDIT_RECIPE,
      id,
      name,
      ingredients
    }
  },

  updateRecipe: function updateRecipe(id, name, ingredients) {
    return {
      type: types.UPDATE_RECIPE,
      id,
      name,
      ingredients
    }
  },
}

// reducers
const initialState = {
  editRecipe: {
    id: -1,
    name: '',
    ingredients: ''
  },
  recipes: [{
    name: 'Pumpin Pie',
    ingredients: 'Pumpkin Puree,Sweetened Condensed Milk,Eggs,Pumpkin Pie Spice,Pie Crust',
    id: 0
  }, {
    name: 'Spahetti',
    ingredients: 'Noodles,Tomato Sauce,(Optional) Meatballs',
    id: 1
  }, {
    name: 'Onion Pie',
    ingredients: 'Onion,Pie Crust,Sounds Yummy right?',
    id: 2
  }]
}

function recipes(state = [], action) {
  switch (action.type) {
    case types.ADD_RECIPE:
      return [
        ...state,
        {
          id: state.reduce((maxId, recipe) => Math.max(recipe.id, maxId), -1) + 1,
          name: action.name,
          ingredients: action.ingredients
        }
      ]

    case types.DELETE_RECIPE:
      return state.filter(recipe =>
        recipe.id !== action.id
      )

    case types.UPDATE_RECIPE:
      return state.map(recipe =>
        recipe.id === action.id ?
          Object.assign({},
                        recipe,
                        { name: action.name,
                          ingredients: action.ingredients
                        })
          : recipe
      )
    default:
      return state
  }
}

function editRecipe(state = {}, action) {
  switch (action.type) {
    case types.EDIT_RECIPE:
      return Object.assign({},
                           state,
                           { id: action.id,
                             name: action.name,
                            ingredients: action.ingredients
                          })
    default:
      return state
  }
}

// Components
/*
const App = (recipes, actions) => (
<div>I am a div</div>
)
*/

const Recipe = ({id, name, ingredients, actions}) =>
  <div className="panel panel-default">
    <div className="panel-heading" role="tab" id="headingOne">
      <h4 className="panel-title">
        <a role="button" data-toggle="collapse" data-parent="#accordion" href={"#collapse" + id} aria-expanded="false" aria-controls="collapseOne">
          ✔ <strong>{name}</strong>
        </a>
      </h4>
    </div>
    <div id={"collapse" + id} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading" + id}>
      <div className="panel-body">
        <h4 className="text-center"> Ingredients</h4>
        <ul className="list-group">
        {
          ingredients.split(',').map((ingredient,i) =>
            <li className="list-group-item" key={i}>{ingredient}</li>
          )
        }
        </ul>
      </div>
      <div className="panel-footer">
        <button type="button" className="btn btn-danger" onClick={() => actions.deleteRecipe(id)}>Delete</button>
        <button type="button" className="btn btn-default" data-toggle="modal" data-target="#myModal1"
         onClick={() => actions.editRecipe(id, name, ingredients)}
        >Edit</button>
      </div>
    </div>
  </div>;

Recipe.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  ingredients: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired
}

const AddRecipe = ({actions}) => {
  let name;
  let ingredients;
  return (
    <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 className="modal-title" id="myModalLabel">Add a Recipe</h4>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label htmlFor="receipe">Recipe</label>
                <input type="text" className="form-control" id="receipe" placeholder="Receipe Name"
                ref={node => {
                  name = node
                }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ingredients">Ingredients</label>
                <input type="text" className="form-control" id="ingredients" placeholder="Enter Ingredients,Seperated,By Commas"
                ref={node => {
                  ingredients = node
                }}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-dismiss="modal"
            onClick={()=>{
              if (!name.value.trim()) {
                return
              }
              if (!ingredients.value.trim()) {
                return
              }
              actions.addRecipe(name.value,ingredients.value);
              name.value = '';
              ingredients.value = '';
            }}>Add Recipe</button>
            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
};

AddRecipe.propTypes = {
  actions: PropTypes.object.isRequired
}

const EditRecipe = ({id, name, ingredients, actions}) => {
  let fname;
  let fingredients;
  return (
    <div className="modal fade" id="myModal1" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 className="modal-title" id="myModalLabel">Edit a Recipe</h4>
          </div>
          <div className="modal-body">
            <form>
              <div className={!name.trim() ? 'form-group has-error': 'form-group'}>
                <label className="control-label" htmlFor="receipe">Recipe</label>
                <input type="text" className="form-control" id="receipe" placeholder="Receipe Name" value={name}
                onChange={()=>actions.editRecipe(id, fname.value, fingredients.value)}
                ref={node => {
                  fname = node
                }}
                />
              </div>
              <div className={!ingredients.trim() ? 'form-group has-error': 'form-group'}>
                <label className="control-label" htmlFor="ingredients">Ingredients</label>
                <input type="text" className="form-control" id="ingredients" placeholder="Enter Ingredients,Seperated,By Commas"
                value={ingredients}
                onChange={()=>actions.editRecipe(id, fname.value, fingredients.value)}
                ref={node => {
                  fingredients = node
                }}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-dismiss={!name.trim() || !ingredients.trim() ? null: "modal"}
            onClick={()=>{
              if (!fname.value.trim()) {
                return
              }
              if (!fingredients.value.trim()) {
                return
              }
              actions.updateRecipe(id,fname.value,fingredients.value);
              fname.value = '';
              fingredients.value = '';
            }}>Save Recipe</button>
            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
};

EditRecipe.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  ingredients: PropTypes.string,
  actions: PropTypes.object.isRequired
}

const App = ({recipes, editRecipe, actions}) => {
  return (
    <div>
    <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
    {
      recipes.map(recipe =>
        <Recipe
          key={recipe.id}
          {...recipe}
          actions={actions}
          />
      )
    }
    </div>
    <div className="row">
      <div className="col-md-12">
        <button type="button" className="btn btn-lg btn-primary" data-toggle="modal" data-target="#myModal">Add Recipe</button>
      </div>
    </div>
    <AddRecipe
      actions={actions}
    />
    <EditRecipe
      id ={editRecipe.id}
      name={editRecipe.name}
      ingredients={editRecipe.ingredients}
      actions={actions}
    />
    <div className="footer">
      <p>♥ from the Zhenkyle</p>
    </div>
    </div>

  );
}

App.propTypes = {
  recipes: PropTypes.array.isRequired,
  editRecipe: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    recipes: state.recipes,
    editRecipe: state.editRecipe
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(RecipeActions, dispatch)
  }
}

let AppRecipe = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)


// Main Program

let currentValue = JSON.parse(window.localStorage.getItem('_zhenkyle_recipes'));
if ( currentValue === null) {
    currentValue = initialState.recipes;
  }

let myState = Object.assign({},
    {recipes: currentValue,
     editRecipe: initialState.editRecipe});

// store
let store = createStore(combineReducers({recipes,editRecipe}),myState,
window.devToolsExtension && window.devToolsExtension());
store.subscribe(() => {
  let previousValue = currentValue;
  currentValue = store.getState().recipes;
  if (previousValue !== currentValue) {
    window.localStorage.setItem('_zhenkyle_recipes',JSON.stringify(currentValue));
  }
})

// render
ReactDOM.render(
  <Provider store={store}>
    <AppRecipe />
  </Provider>,
  document.getElementById('root')
)
