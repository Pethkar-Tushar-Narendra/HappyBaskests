import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Products from '../components/Products';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: '0 to 1000',
    value: '0-1000',
  },
  {
    name: '1000 to 10000',
    value: '1000-10000',
  },
  {
    name: '10000 to 100000',
    value: '10000-100000',
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      // dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, page, price, query]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterPrice = filter.price || price;
    return `/search?category=${filterCategory}&page=${filterPage}&query=${filterQuery}&price=${filterPrice}`;
  };

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <ListGroup>
            <ListGroup.Item className="search-category">
              <h3>Categories</h3>
            </ListGroup.Item>
            <ListGroup.Item className="search-category">
              <Link
                className={'all' === category ? 'text-bold' : ''}
                to={getFilterUrl({ category: 'all' })}
              >
                Any
              </Link>
            </ListGroup.Item>

            {categories.map((c) => (
              <ListGroup.Item key={c} className="search-category">
                <Link
                  className={c === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: c })}
                >
                  {c}
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <ListGroup>
            <ListGroup.Item className="search-category">
              <h3>Price</h3>
            </ListGroup.Item>
            <ListGroup.Item className="search-category">
              <Link
                className={'all' === price ? 'text-bold' : ''}
                to={getFilterUrl({ price: 'all' })}
              >
                Any
              </Link>
            </ListGroup.Item>

            {prices.map((p) => (
              <ListGroup.Item key={p.value} className="search-category">
                <Link
                  to={getFilterUrl({ price: p.value })}
                  className={p.value === price ? 'text-bold' : ''}
                >
                  {p.name}
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <div>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? 'No' : countProducts} Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price ' + price}
                    {query !== 'all' ||
                    category !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
              </Row>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}
              <Row>
                {products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <Products product={product}></Products>
                  </Col>
                ))}
              </Row>
              <div>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
