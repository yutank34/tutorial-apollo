import logo from './logo.svg';
import './App.css';
import './index.js'
import { useState } from "react";

import {
  useQuery,
  gql
} from "@apollo/client";

function App() {

  const [selectedDog, setSelectedDog] = useState(null);

  console.log(selectedDog)
  console.log(setSelectedDog)

  function onDogSelected({ target }) {
    setSelectedDog(target.value);
  }

  const GET_DOGS = gql`
  query GetDogs {
    dogs {
      id
      breed
    }
  }
`;
function Dogs({ onDogSelected }) {
  const { loading, error, data } = useQuery(GET_DOGS);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <select name="dog" onChange={onDogSelected}>
      {
        data.dogs.map(dog => (
          <option key={dog.id} value={dog.breed}>
            {dog.breed}
          </option>
        ))
      }
    </select>
  )
}

const GET_DOG_PHOTO = gql`
  query Dog($breed: String!) {
    dog(breed: $breed) {
      id
      displayImage
    }
  }
`;
  
  function DogPhoto({ breed }) {
    const { loading, error, data } = useQuery(GET_DOG_PHOTO, {
      variables: { breed },
    });
  
    if (loading) return null;
    if (error) return `Error! ${error}`;
  
    return (
      <img src={data.dog.displayImage} style={{ height: 100, width: 100 }} />
    );
  }

  return (
    <div>
      <h2>My first Apollo app 🚀</h2>
      <Dogs onDogSelected={onDogSelected}/>
      <DogPhoto breed={selectedDog}/>
    </div>
  );
}

export default App;
