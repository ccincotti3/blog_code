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

int main() {
    float x0 = 100000.0;
    float y0 = 100.0;

    float h = 1;
    int maxSteps = 10;

    float k = 1.0;

    // Xnew = X0 + hf(Xnew)
    Matrix Xnew = MatCreate(2, 1);
    Matrix X0 = MatCreate(2, 1);
    MatSet(&Xnew, 0, 0, x0);
    MatSet(&Xnew, 1, 0, y0);

    // X0 + dX = X0 + hf(X0 + dX).
    Matrix dX = MatCreate(2, 2);
    MatSet(&dX, 0, 0, -h / (h + 1.0));
    MatSet(&dX, 1, 1, -h / (k*h + 1.0));

    Matrix TempDeltaX = MatCreate(2,2);

    for(int i = 0; i < maxSteps;++i) {
        MatPrint(&Xnew);
        MatSet(&X0, 0, 0, MatGet(&Xnew, 0, 0));
        MatSet(&X0, 1, 0, MatGet(&Xnew, 1, 0) * k);
        TempDeltaX = MatMultiply(&dX, &X0);
        MatAdd(&Xnew, &Xnew, &TempDeltaX);
    }

    MatPrint(&Xnew);
   
    // Clean up
    MatDestroy(&X0);
    MatDestroy(&dX);

    return 0;
}

