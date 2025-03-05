// src/module/client/pages/Home.js
import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Our Store!
      </Typography>
      <Typography variant="h6" paragraph>
        Explore our collection of amazing products.
      </Typography>
      
      {/* Example of Featured Products */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="https://via.placeholder.com/200"
              alt="Product 1"
            />
            <CardContent>
              <Typography variant="h6">Product 1</Typography>
              <Typography variant="body2" color="text.secondary">
                Description of the product.
              </Typography>
              <Button component={Link} to="/shop" variant="contained" sx={{ marginTop: 2 }}>
                Shop Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="https://via.placeholder.com/200"
              alt="Product 2"
            />
            <CardContent>
              <Typography variant="h6">Product 2</Typography>
              <Typography variant="body2" color="text.secondary">
                Description of the product.
              </Typography>
              <Button component={Link} to="/shop" variant="contained" sx={{ marginTop: 2 }}>
                Shop Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
