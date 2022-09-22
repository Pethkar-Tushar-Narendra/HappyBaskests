import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    default:
      return state;
  }
};

export default function SellerAddCategoryScreen() {
  const navigate = useNavigate();
  const [{ loadingCreate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [category, setCategory] = useState('');
  const [confirmCategory, setConfirmCategory] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Are you sure to '${category}' create?`)) {
      return;
    }
    if (category !== confirmCategory) {
      toast.error('Category do not match');
      return;
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      await axios.post(
        `/api/products/addcategory`,
        {
          category,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Category craeted successfully');
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Create Category </title>
      </Helmet>
      <h1>Create Category</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Category</Form.Label>
          <Form.Control
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="slug">
          <Form.Label>Confirm Category</Form.Label>
          <Form.Control
            value={confirmCategory}
            onChange={(e) => setConfirmCategory(e.target.value)}
            required
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Create</Button>
          {loadingCreate && <LoadingBox></LoadingBox>}
        </div>
      </Form>
    </Container>
  );
}
