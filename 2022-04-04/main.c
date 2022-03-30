/**
 * @file main.c
 * @author Carmen Cincotti (carmencincotti.com)
 * @brief Examples of implicit differentation
 * @version 0.1
 * @date 2022-03-26
 *
 */
#include <stdio.h>
#include <stdlib.h>
#include "matrix.h"

int solve(float x0, float y0, float stepSize, Matrix hTerm, float k, FILE* fp) {
    int maxSteps = 10;

    // Xnew = X0 + hTerm*dX
    Matrix Xnew = MatCreate(2, 1);
    Matrix dX = MatCreate(2, 1);

    MatSet(&Xnew, 0, 0, x0);
    MatSet(&Xnew, 1, 0, y0);

    Matrix TempDeltaX = MatCreate(2, 2);

    for (int i = 0; i < maxSteps;++i) {
        fprintf(fp, "%f\t %f\n", stepSize * i, y0);

        MatSet(&dX, 0, 0, x0);
        MatSet(&dX, 1, 0, y0 * k);

        TempDeltaX = MatMultiply(&hTerm, &dX);

        // Xnew = X0 + DeltaX
        MatAdd(&Xnew, &Xnew, &TempDeltaX);

        x0 = MatGet(&Xnew, 0, 0);
        y0 = MatGet(&Xnew, 1, 0);
    }

    // Clean up
    MatDestroy(&Xnew);
    MatDestroy(&dX);
}

/**
 * @brief
 *
 * @param argc
 * @param argv [0, h, k, x0, y0]
 * @return int
 */
int main(int argc, char* argv[]) {
    if (argc < 4) // no arguments were passed
    {
        printf("Please pass 4 floats that define h, k, x0, y0 in this order");
        return 1;
    }

    FILE* fp = NULL;

    float h = atof(argv[1]);
    float k = atof(argv[2]);

    float x0 = atof(argv[3]);
    float y0 = atof(argv[4]);
    printf("Solving for:\nh=%f\nk=%f\nx0=%f\ny0=%f", h, k, x0, y0);

    Matrix hTerm = MatCreate(2, 2);

    // EXPLICIT
    MatSet(&hTerm, 0, 0, -h);
    MatSet(&hTerm, 1, 1, -h);
    fp = fopen("explicit.txt", "w");
    solve(x0, y0, h, hTerm, k, fp);
    fclose(fp);

    // IMPLICIT
    MatSet(&hTerm, 0, 0, -h / (h + 1.0));
    MatSet(&hTerm, 1, 1, -h / (k * h + 1.0));

    fp = fopen("implicit.txt", "w");
    solve(x0, y0, h, hTerm, k, fp);
    fclose(fp);

    // Clean up
    MatDestroy(&hTerm);

    return 0;
}

