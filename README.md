Recipe Help
=========

In modern web applications, communication between the frontend application that is running on a persons phone, or in their browser and the backend servrer happens using JSON objects.  The server makes several URLs available that the front end can then send requests to in order to retrieve information and update records.

[![YouTube](http://img.youtube.com/vi/LNOGzVkopL4/0.jpg)](https://www.youtube.com/watch?v=LNOGzVkopL4)


Public API's
================
There are many publically available and free APIs available for us to practice with, and even build into real applications if we choose.  API stands for "Application Programatic Interface".  Below are a few websites you can go to discover them.  For this exersise, we're going to choose an API that doesn't require authentication, and then build a React application around it.

- [Public apis](https://github.com/public-apis/public-apis)
- [APIList.fun](https://apilist.fun)
- [diycode.cc](https://www.diycode.cc/projects/toddmotto/public-apis)


Project Description
======================
We've choosen to build an application around the food2fork.com api.  Its a list of recipes that our users will be able to search by ingredients to get ideas about dinner

Planning
============
Let's start with some stories to work on:

- As a user I want to see a list of recipes.
- As a user, I want to be able to enter a comma separated list of ingredients and get a list of recipes back.
- As a user, I want to be able to click on the recipe and be taken to a page with more information.

Perfect,  from there we can draw up a quick wireframe for this application.  We'll be using Bootstrap, so its a good idea to keep the tools Bootstrap provides when laying out the pages.

![wireframe](./public/IMG_0131.PNG)


Getting to work
====================

### Create React App

### Add Bootstrap and react-bootstrap
Find a nice bootstrap theme you would like to use.  For example,  checkout [these](https://bootswatch.com).  Download the bootstrap.min.css file, and put it in your '/public' directory.  Then,  in '/public/index.html', you can add a link to it in the <head> section.

```html
<link rel="stylesheet" href="%PUBLIC_URL%/bootstrap.min.css"/>
```

Now we're ready to add react-boostrap.  From the terminal:

```bash
$ yarn add react-bootstrap
-- OR --
$ npm install react-bootstrap
```


### Main UI Components
Next, let's get the main UI components from our wireframe in place.  If we look through the Bootstrap documentation, we see that a Jumbotron element is almost exactly what we want for the top section, a ListGroup will do nicely for the results.

![components](./public/IMG_0132.PNG)


### Clickable Wireframe
We're going to start hard coding elements on the page to get the UI we want.  Afterwards, we'll fetch live data, and use it to build the page.  Some people call this step a "Clickable Wireframe".  That indicates that all the interactable components are real, but nothing is hooked up yet.

![clickable](./public/recipe-interface.png)

Here's the code to make that happen:
```Javascript
import React from 'react';
import {
  Form,
  Jumbotron,
  Button,
  ListGroup,
} from 'react-bootstrap'

class App extends React.Component {
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
                <Form.Control type="text" placeholder="comman, separated, list" />
                <Button variant="outline-primary">Search</Button>
              </div>
            </div>
          </div>

        </Jumbotron>
        <div className="d-flex justify-content-center">
          <div className='col-sm-5'>
            <ListGroup>
              <ListGroup.Item>Cras justo odio</ListGroup.Item>
              <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
              <ListGroup.Item>Morbi leo risus</ListGroup.Item>
              <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
              <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
            </ListGroup>
          </div>
        </div>j

      </div>
    );
  }
}

export default App;
```

### Connect the API
We're now in a good spot to connect with the recipe API.  The first step is to load a sample list of recipes to the page.  Afterwards, we'll hook in the Search feature.

Here's the finished application.  Notice that we switched from using a <ListGroup> to using the Bootstrap element <Card>  It accomplishes the same thing in the UI, and looks nicer:

```Javascript
import React from 'react';
import {
  Alert,
  Card,
  Form,
  Jumbotron,
  Button,
} from 'react-bootstrap'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      recipes: [], // Keeps track of our list of recipes
      searchValue: '', // Its a controlled form input
      error: null // If we get an error from the API request, it gets put here
    }
  }

  componentDidMount = () =>{
    this.getRecipes() //Kicks off initial list of recipes
  }

  search = ()=>{
    this.getRecipes(this.state.searchValue) // When a user clicks 'search', re-send the request to the api, with search values
  }

  getRecipes = (q)=>{ //Method to query the API
    this.setState({ recipes: [] }) //Clears the recipe list
    const apiKey='a6894f29755de2438c2b9fb553b2931d'
    var searchUrl = `https://www.food2fork.com/api/search?key=${apiKey}`
    if(q){ //if user has entered a search value, we add it to the request URL
      searchUrl = `${searchUrl}&q=${q}`
    }
    fetch(searchUrl)  //Fetch returns a promise
    .then((resp)=> {
      if(resp.status !== 200){ throw({message: "Could not perform search. Please try again."}) }
      return resp.json() //We need to grab the JSON from the response
    })
    .then( (payload) => {
      const{ recipes } = payload
      this.setState({recipes}) //Finally, we can add the found recipes to our list, triggering a re-render
    })
    .catch((error) => this.setState({error}))
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
            {this.state.error &&
              <Alert variant="danger">{this.state.error.message}</Alert>
            }
            {this.state.recipes.map((recipe, index)=>{
              return(
                <Card key={index}>
                  <Card.Img variant="top" src={recipe.image_url} />
                  <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>
                    <a
                      href={recipe.source_url}
                      className='btn btn-outline-primary'
                      target="_blank"
                      rel="noopener noreferrer"
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
```

![finished](./public/finished-api-example.png)


# Simple fetch for IP address

```Javascript
import React from 'react';
import './App.css';

class App extends React.Component{
  constructor(props){
    super(props)
      this.state = {
        myIP: 0
    }
  }

  componentDidMount() {
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(payload => this.setState({ myIP: payload.ip }))
  }

  render(){
    return(
      <div>
        <p>{ this.state.myIP }</p>
      </div>
    )
  }
}

export default App;
```

this is the full JSON object (example):

```Javascript
{
    "ip": "208.67.222.222",
    "city": "San Francisco",
    "region": "California",
    "region_code": "CA",
    "country": "US",
    "country_name": "United States",
    "continent_code": "NA",
    "in_eu": false,
    "postal": "94107",
    "latitude": 37.7697,
    "longitude": -122.3933,
    "timezone": "America/Los_Angeles",
    "utc_offset": "-0400",
    "country_calling_code": "+1",
    "currency": "USD",
    "languages": "en-US,es-US,haw,fr",
    "asn": "AS36692",
    "org": "OpenDNS, LLC"
}
```

https://ipapi.co/api/?shell#complete-location5
