import React from 'react';
import {
      Card,
      Form,
      Image,
      Jumbotron,
      Button,
      ListGroup,
} from 'react-bootstrap'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      recipes: [],
      searchValue: ''
    }

    this.getRecipes()
  }

  search = ()=>{
    this.getRecipes(this.state.searchValue)
  }

  getRecipes = (q)=>{
    this.setState({ recipes: [] })
    const apiKey='a6894f29755de2438c2b9fb553b2931d'
    var searchUrl = "https://www.food2fork.com/api/search?key=a6894f29755de2438c2b9fb553b2931d"
    if(q){
            searchUrl = `${searchUrl}&q=${q}`
    }
    fetch(searchUrl)
    .then((resp)=> {
            return resp.json()
    })
    .then( (payload) => {
            const{ recipes } = payload
            this.setState({recipes})
    })
    .catch((error) => console.log("Error:", error))
  }
  render(){
    return (
      <div className="App">
        <Jumbotron>
          <div className="d-flex justify-content-center">
            <div className='col-sm-5'>
              <h1>What's for Dinner?</h1>
              <p>
                Use the search below to help you with dinner ideas based on what you already have in the kitchen.  Just enter a few ingredients, and get inspired!
              </p>
              <hr/>
              <h5>Ingredients</h5>
              <div className='form-inline'>
                <Form.Control
                  type="text"
                  placeholder="comman, separated, list"
                  onChange={(e)=> this.setState({searchValue: e.target.value})}
                  value={this.state.searchValue}
                />
                <Button onClick={this.search} variant="outline-primary">Search</Button>
              </div>
            </div>
          </div>

        </Jumbotron>
        <div className="d-flex justify-content-center">
          <div className='col-sm-5'>
            {this.state.recipes.map((recipe)=>{
              return(
                <Card>
                  <Card.Img variant="top" src={recipe.image_url} />
                  <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>
                    <a
                      href={recipe.source_url}
                      className='btn btn-outline-primary'
                      target="_blank"
                    >
                      {recipe.publisher}
                    </a>
                  </Card.Body>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
