import React, { useEffect, useState } from "react";

import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createTodo } from "../graphql/mutations";
import { listTodos } from "../graphql/queries";
import awsExports from "../aws-exports";

import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import Avatar from "../components/Avatar";
import python_logo from "../assets/python_logo.png";
import circuit_logo from "../assets/circuit.png";
import ai_logo from "../assets/ai_logo.png";

Amplify.configure(awsExports);

const ImageIcons = styled(Avatar)`
  margin-left: 10px;
  margin-right: 10px;
`;

const styles = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: "bold" },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
};

const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  img {
    margin-left: 20px;
    margin-right: 20px;
  }
`;

const initialState = { name: "", description: "" };

const Landing = () => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log("error fetching todos");
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }
  return (
    <div className="text-center cover-container d-flex p-3 mx-auto flex-column">
      <Helmet>
        <title>Twelve : Welcome</title>
        <link rel="canonical" href="http://www.twelve.community" />
        <meta
          name="keywords"
          content="spiritual,based,social,platform,Anonymity,designing principle,recovery,purpose,connection,modern technology"
        />
      </Helmet>
      <main role="main" className="inner cover">
        <div className="jumbotron ">
          <p className="lead">Design temporary.</p>
          <ImageContainer>
            <ImageIcons image={python_logo} height={"100px"} width={"100px"} />
            <ImageIcons image={circuit_logo} height={"100px"} width={"100px"} />
            <ImageIcons image={ai_logo} height={"100px"} width={"100px"} />
          </ImageContainer>
        </div>
        <h1 className="cover-heading">Story Driven Recovery</h1>
        <p className="lead">
          Twelve Community is a non-profit Spiritually-based social platform
          with a mission to create a safe and secure platform for all to share
          personal stories of recovery, become involved with our communities
          through service, guiding others through sponsorship, and supporting
          our local and global communities through charitable donation.
        </p>
        <p className="lead">
          User stories are submitted and analyzed through machine-learning with
          help of artificial intelligence (using Python, DeepMind), then used to
          make recommendations for recovery tools, meetings, etc
        </p>
        <p className="lead">
          Through machine-learning, artificial intelligence and the sharing of
          our own stories we can become involved with our communities through
          service, sponsorship, and support for our local and global
          communities.
        </p>
        <h2>Amplify Todos</h2>
        <input
          onChange={(event) => setInput("name", event.target.value)}
          style={styles.input}
          value={formState.name}
          placeholder="Name"
        />
        <input
          onChange={(event) => setInput("description", event.target.value)}
          style={styles.input}
          value={formState.description}
          placeholder="Description"
        />
        <button style={styles.button} onClick={addTodo}>
          Create Todo
        </button>
        {todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
            <p style={styles.todoName}>{todo.name}</p>
            <p style={styles.todoDescription}>{todo.description}</p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Landing;
