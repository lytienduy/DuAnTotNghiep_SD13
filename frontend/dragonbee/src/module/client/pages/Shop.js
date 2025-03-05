// src/module/client/pages/Shop.js
import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';

const Shop = () => {
  const products = [
    { id: 1, name: 'Product 1', description: 'A great product', image: 'https://via.placeholder.com/200' },
    { id: 2, name: 'Product 2', description: 'Another great product', image: 'https://via.placeholder.com/200' },
    { id: 3, name: 'Product 3', description: 'The best product', image: 'https://via.placeholder.com/200' },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Our Products
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Button variant="contained" sx={{ marginTop: 2 }}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Shop;
