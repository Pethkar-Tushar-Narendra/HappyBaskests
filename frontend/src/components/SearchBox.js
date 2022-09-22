import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };
  return (
    <Form className="d-flex" onSubmit={submitHandler}>
      <Form.Control
        type="search"
        placeholder="Search"
        className="me-2"
        aria-label="Search"
        onChange={(e) => setQuery(e.target.value)}
      ></Form.Control>
      <Button variant="outline-warning" type="submit">
        Search
      </Button>
    </Form>
  );
}
