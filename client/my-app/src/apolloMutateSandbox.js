import React, { useState, useEffect } from 'react';
import './App.css';
import './index.js';
import { Link } from 'react-router-dom';
import {
    gql,
    useQuery,
    useMutation,
} from '@apollo/client';

function ApolloMutateSandboxPage() {
    return (
        <div>
            <h2>mutate!</h2>
            <Todos />
            <AddTodo />
            <Link to={`/`}>Back to TOP</Link>
        </div>
    )
}

const GET_TODOS = gql`
  {
    todos {
      id
      type
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($type: String!) {
    addTodo(type: $type) {
      id
      type
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!, $type: String!) {
    updateTodo(id: $id, type: $type) {
      id
      type
    }
  }
`;


function Todos() {
    const { loading: queryLoading, error: queryError, data } = useQuery(
        GET_TODOS,
    );
    const [
        updateTodo,
        { loading: mutationLoading, error: mutationError },
    ] = useMutation(UPDATE_TODO);

    if (queryLoading) return <p>Loading...</p>;
    if (queryError) return <p>Error :(</p>;


    return data.todos.map(({ id, type }) => {
        let input;

        return (
            <div key={id}>
                <p>{type}</p>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        updateTodo({ variables: { id, type: input.value } });
                        input.value = '';
                    }}
                >
                    <input
                        ref={node => {
                            input = node;
                        }}
                    />
                    <button type="submit">Update Todo</button>
                </form>
                {mutationLoading && <p>Loading...</p>}
                {mutationError && <p>Error :( Please try again</p>}
            </div>
        );
    });
}

function AddTodo() {
    let input;
    // const [addTodo, { data }] = useMutation(ADD_TODO);
    const [addTodo] = useMutation(ADD_TODO, {
        update(
            cache,
            {
                data: { addTodo }
            }
        ) {
            cache.modify({
                fields: {
                    todos(existingTodos = []) {
                        const newTodoRef = cache.writeFragment({
                            data: addTodo,
                            fragment: gql`
                    fragment NewTodo on Todo {
                      id
                      type
                    }
                  `
                        });
                        return [...existingTodos, newTodoRef];
                    }
                }
            });
        }
    });

    // const f = (e) => {
    //     e.preventDefault();
    //     addTodo({ variables: { type: input.value } });
    //     input.value = '';
    // }


    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    addTodo({ variables: { type: input.value } });
                    input.value = '';
                }}
            >
                <input
                    ref={node => {
                        input = node;
                    }}
                />
                <button type="submit">Add Todo</button>
            </form>
        </div>
    );
}

export default ApolloMutateSandboxPage;