import React from 'react';
import { Skeleton, Card, CardContent, Box } from '@mui/material';

const ProductCardSkeleton = () => {
    return (
        <Card>
            {/* Skeleton para a imagem do produto */}
            <Skeleton variant="rectangular" width="100%" height={180} />
            <CardContent>
                {/* Skeleton para o nome do produto */}
                <Skeleton variant="text" sx={{ fontSize: '1.2rem', mb: 1 }} />

                {/* Skeleton para a descrição/preço */}
                <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />

                {/* Skeleton para o botão */}
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: '8px' }}/>
            </CardContent>
        </Card>
    );
};

export default ProductCardSkeleton;