import React, { useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import axios from 'axios';
import { getError } from '../utils';
import { toast } from 'react-toastify';

export default function SignUpScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectURL = new URLSearchParams(search).get('redirect');
  const redirect = redirectURL ? redirectURL : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { dispatch: ctxDispatch } = useContext(Store);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      window.alert('Passwords do not match');
      return;
    }
    try {
      const { data } = await axios.post('/api/users/signup', {
        name,
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Form.Group>
        <div className="mb-3">
          <Button variant="outline-warning" type="submit">
            Sign Up
          </Button>
        </div>
        <div className="mb-3">
          Already have an account?{' '}
          <Link to={`/login?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
}
