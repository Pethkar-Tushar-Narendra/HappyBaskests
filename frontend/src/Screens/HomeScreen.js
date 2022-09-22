import React, { useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Products from '../components/Products';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
// import Corousal from '../components/Corousal';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function HomeScreen() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;
  const [{ loading, error, products, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    products: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products?page=${page}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: err.message,
        });
      }
    };
    fetchData();
  }, [page]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    return `?page=${filterPage}`;
  };

  return (
    <div>
      <Helmet>
        <title>E-Mart</title>
      </Helmet>
      {/* <h1>Carousel</h1>
      <div id="corousal">
        <Corousal />
      </div> */}
      <h1>Featured Products</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="products">
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={2} className="mt-3">
                <Products product={product}></Products>
              </Col>
            ))}
          </Row>
        </div>
      )}
      <br />{' '}
      {loading || (
        <Row>
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
        </Row>
      )}
    </div>
  );
}
