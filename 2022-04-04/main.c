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
    // y_1 = y_0 + h * f(x_1, y_1)
    // y_1 - h * f(x_1, y_1) = y_0

    // set IVP y(0) = 1
    // float y0 = 1.0;
    // float x0 = 0.0; 
    // float h = 0.2;
    // float xf = 1.0; 

    // float x1 = x0;

    // while(x0 < xf) {
    //     x1 += h;

    // }

    Matrix m1 = MatCreate(2, 2);
    MatSet(&m1, 0, 0, 1.0);
    MatSet(&m1, 1, 1, 2.0);
    float value = MatGet(&m1, 0, 0);
    float value_two = MatGet(&m1, 1, 1);
    printf("%f\n%f\n", value, value_two);
    MatDestroy(&m1);

    return 0;
}

