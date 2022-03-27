#ifndef MATRIX_H_ 
#define MATRIX_H_

#include <stdio.h>

typedef struct {
    size_t rows, cols; /* dimensions */
    float (**m); /* pointer to actual contents */
} Matrix;

Matrix MatCreate(size_t row, size_t col); 
void MatDestroy(Matrix * m); 
void MatSet(Matrix * m, size_t i, size_t j, float val);
float MatGet(Matrix * m, size_t i, size_t j);

#endif // MATRIX_H_