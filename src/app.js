import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import filterRoutes from './routes/filterRoutes.js';
import selectionRoutes from "./routes/selectionRoutes.js";
import kriteriaRoutes from './routes/kriteriaRoutes.js';


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/filters', filterRoutes);
app.use('/api/selection', selectionRoutes);
app.use('/api/kriteria', kriteriaRoutes);


export default app;
