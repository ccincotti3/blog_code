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

void MatPrint(Matrix* A) {
    for (size_t i = 0; i < A->rows; ++i) {
        printf("row %ld | ", i);
        for (size_t j = 0; j < A->cols; ++j) {
            printf("%f ", A->m[i][j]);
        }
        printf("\n");
    }
}

void MatAdd(Matrix* target, Matrix* A, Matrix* B) {
    if (A->rows != B->rows || A->cols != B->cols) {
        fprintf(stderr, "Cannot ADD matrices of different dimensions");
        exit(EXIT_FAILURE);
    }

    for (size_t i = 0; i < A->rows; ++i) {
        for (size_t j = 0; j < A->cols; ++j) {
            target->m[i][j] = A->m[i][j] + B->m[i][j];
        }
    }
}

Matrix MatMultiply(Matrix* A, Matrix* B) {
    if (A->cols != B->rows) {
        fprintf(stderr, "Cannot MULTIPLY matrices - dimension error");
        exit(EXIT_FAILURE);
    }

    Matrix out = MatCreate(A->rows, B->cols);

    for (int i = 0; i < A->rows; i++) {
        for (int j = 0; j < B->cols; j++) {
            out.m[i][j] = 0;
            for (int k = 0; k < A->cols; k++) {
                out.m[i][j] += A->m[i][k] * B->m[k][j];
            }
        }
    }
    return out;
}

void MatDestroy(Matrix* matrix) {
    free(matrix->m[0]);
    free(matrix->m);
}

void MatSet(Matrix* m, size_t i, size_t j, float val) {
    if (i >= m->rows || j >= m->cols) {
        fprintf(stderr, "Setting matrix indices - out of bounds! Exiting...\n");
        exit(EXIT_FAILURE);
    }

    m->m[i][j] = val;
}

float MatGet(Matrix* m, size_t i, size_t j) {
    if (i >= m->rows || j >= m->cols) {
        fprintf(stderr, "Getting matrix indices - out of bounds! Exiting...\n");
        exit(EXIT_FAILURE);
    }
    return m->m[i][j];
}