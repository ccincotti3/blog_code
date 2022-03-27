/**
 * @file matrix.c
 * @author Carmen Cincotti (carmencincotti.com)
 * @brief Matrix operations
 * @version 0.1
 * @date 2022-03-27
 *
 */

#include <stdlib.h>
#include "matrix.h"

Matrix MatCreate(size_t rows, size_t cols) {
    float** matrix = (float**)malloc(rows * sizeof(float*));
    matrix[0] = (float*)malloc(rows * cols * sizeof(float));
    for (size_t i = 1; i < rows; i++) {
        matrix[i] = matrix[0] + i * cols;
    }
    Matrix m1 = { rows, cols, matrix };

    return m1;
}

void MatDestroy(Matrix* matrix) {
    free(matrix->m[0]);
    free(matrix->m);
}

void MatSet(Matrix * m, size_t i, size_t j, float val) {
    if(i >= m->rows || j >= m-> cols) {
        fprintf(stderr, "Setting matrix indices - out of bounds! Exiting...\n");
        exit(EXIT_FAILURE);
    }

    m->m[i][j] = val;
}

float MatGet(Matrix * m, size_t i, size_t j) {
    if(i >= m->rows || j >= m-> cols) {
        fprintf(stderr, "Getting matrix indices - out of bounds! Exiting...\n");
        exit(EXIT_FAILURE);
    }
    return m->m[i][j];
}