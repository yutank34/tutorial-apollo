import React from 'react';
import './App.css';
import './index.js'
import { useState } from "react";
import { Link } from 'react-router-dom';
import {
  useQuery,
  gql,
  NetworkStatus,
  useLazyQuery
} from "@apollo/client";

function ApolloFetchSandboxPage() {

    const [selectedDog, setSelectedDog] = useState('-');

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
        const { loading, error, data } = useQuery(GET_DOGS, {
            fetchPolicy: "network-only"
        });

        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        return (
            <select name="dog" onChange={onDogSelected} value={selectedDog}>
                <option key="-" value="-">
                        -
                </option>
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

        const { loading, error, data, refetch, networkStatus } = useQuery(GET_DOG_PHOTO, {
            variables: { breed },
            notifyOnNetworkStatusChange: true,
            // pollInterval: 500, // start polling 
        });

        if (networkStatus === NetworkStatus.refetch) return 'Refetching!';
        if (loading) return null;
        if (error) return `Error! ${error}`;

        const result = data.dog.id === "J" ? null : <img src={data.dog.displayImage} style={{ height: 100, width: 100 }} alt={breed} />;
  
        return (
            <>
                {result}
                <button onClick={() => refetch()}>Refetch!</button>
            </>
        );
    }

    function DelayedQuery() {
        const [getDog, { loading, data }] = useLazyQuery(GET_DOG_PHOTO);
      
        if (loading) return <p>Loading ...</p>;
      
        return (
          <div>
            {data && data.dog && <img src={data.dog.displayImage} alt={data.dog.breed}/>}
            <button onClick={() => getDog({ variables: { breed: 'bulldog' } })}>
              Click me!
            </button>
          </div>
        );
      }

    return (
        <div>
            <h2>My first Apollo app 🚀</h2>
            <div>
                <Dogs onDogSelected={onDogSelected}/>
                <DogPhoto breed={selectedDog}/>
                <DelayedQuery />
            </div>
            <Link to={`/`}>Back to TOP</Link>
        </div>
    );
}

export default ApolloFetchSandboxPage;