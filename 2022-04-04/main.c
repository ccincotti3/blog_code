/**
 * @file main.c
 * @author Carmen Cincotti (carmencincotti.com)
 * @brief Examples of implicit differentation
 * @version 0.1
 * @date 2022-03-26
 *
 */
#include <stdio.h>
#include "matrix.h"

int main(int argc, char *argv[]) {
    // Open files to write data to
    FILE* fp = NULL;
    fp = fopen("result.txt", "w");

    float x0 = 100000.0;
    float y0 = 100.0;

    float h = 2;
    int maxSteps = 10;

    float k = 1.0;

    // Xnew = X0 + hTerm*dX
    Matrix Xnew = MatCreate(2, 1);
    Matrix hTerm = MatCreate(2, 2);
    Matrix dX = MatCreate(2, 1);

    MatSet(&Xnew, 0, 0, x0);
    MatSet(&Xnew, 1, 0, y0);

    // MatSet(&hTerm, 0, 0, -h / (h + 1.0));
    // MatSet(&hTerm, 1, 1, -h / (k*h + 1.0));

    MatSet(&hTerm, 0, 0, -h);
    MatSet(&hTerm, 1, 1, -h);

    Matrix TempDeltaX = MatCreate(2, 2);

    for (int i = 0; i < maxSteps;++i) {
        fprintf(fp, "%f\t %f\n", h * i, y0);

        MatSet(&dX, 0, 0, x0);
        MatSet(&dX, 1, 0, y0 * k);

        TempDeltaX = MatMultiply(&hTerm, &dX);

        // Xnew = X0 + DeltaX
        MatAdd(&Xnew, &Xnew, &TempDeltaX);

        x0 = MatGet(&Xnew, 0, 0);
        y0 = MatGet(&Xnew, 1, 0);
    }

    MatPrint(&Xnew);

    // Clean up
    MatDestroy(&Xnew);
    MatDestroy(&hTerm);
    MatDestroy(&dX);

    return 0;
}

