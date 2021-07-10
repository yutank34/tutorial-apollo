import React from 'react';
import './App.css';
import './index.js'
import { useState } from "react";
import { Link } from 'react-router-dom';
import {
  useQuery,
  gql
} from "@apollo/client";

function ApolloSandboxPage() {

    const [selectedDog, setSelectedDog] = useState(null);

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

        // Set state to display the image at initial display
        if (!selectedDog) {
            setSelectedDog(data.dogs[0].breed);
        }

        return (
            <select name="dog" onChange={onDogSelected} value={selectedDog}>
                {
                    data.dogs.map(dog => (
                        <option key={dog.id} value={dog.breed} >
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
            <div>
                <Dogs onDogSelected={onDogSelected}/>
                <DogPhoto breed={selectedDog}/>
            </div>
            <Link to={`/sandbox`}>Go to Sandbox</Link>
        </div>
    );
}

export default ApolloSandboxPage;