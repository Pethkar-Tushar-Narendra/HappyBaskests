import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';

export default function Products(props) {
  const { product } = props;
  return (
    <Card>
      <Link
        style={{ textDecoration: 'none', color: 'black' }}
        to={`/product/${product._id}`}
      >
        <img
          src={product.image}
          className="card-img-top"
          alt={product.name}
          style={{ maxHeight: '150 px' }}
        />
        <Card.Body>
          <Card.Title style={{ textTransform: 'capitalize' }}>
            {product.name}
          </Card.Title>
          <Rating rating={product.rating} numReviews={product.numReviews} />
          <Card.Text>
            Price : &#8377;
            <b> {product.price} </b>/ {product.per}
          </Card.Text>
          {product.countInStock === 0 ? (
            <Button variant="light" disabled>
              Out Of Stock
            </Button>
          ) : (
            <Button variant="warning" disabled>
              In Stock
            </Button>
          )}
        </Card.Body>
      </Link>
    </Card>
  );
}
