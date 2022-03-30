/*
	methods.c

	Plotting solutions to equations solved by numerical methods
	compared to analytical solution

	Created by Carmen Cincotti on 03/14/2022
*/
#include <stdio.h>
#include <math.h>
#include <string.h>
#include <time.h>

float f(float t, float y) {
	return y;
}

float euler(float t, float y, float h) {
	return y + h * f(t, y);
}

float midpoint(float t, float y, float h) {
	// calculate k1 at start of step
	float k1 = f(t, y);

	// calculate intermediate step
	float yi = y + k1 * (0.5 * h);

	// calculate the new slope with k1
	float k2 = f(t + 0.5 * h, yi);
	return y + k2 * h;
}

float rungekutta4(float t, float y, float h) {
	float k1 = f(t, y);
	float k2 = f(t + 0.5 * h, y + k1 * (h / 2));
	float k3 = f(t + 0.5 * h, y + k2 * (h / 2));
	float k4 = f(t, y + k3 * h);
	float m = (k1 + 2. * k2 + 2. * k3 + k4) / 6.;
	return y + h * m;
}

void get_input(float (**method_ptr)(float t, float y, float h), char* method_name_str, float* h) {
	unsigned short selection;
	do {
		printf("Please select a method \n1. Euler\n2. Midpoint\n3: Runge-Kutta 4th Order\nYour Selection: ");
		scanf("%hd", &selection);
		switch (selection) {
		case 1:
			(*method_ptr) = &euler;
			strcpy(method_name_str, "euler");
			break;
		case 2:
			(*method_ptr) = &midpoint;
			strcpy(method_name_str, "midpoint");
			break;
		case 3:
			(*method_ptr) = &rungekutta4;
			strcpy(method_name_str, "rk4");
			break;
		default:
			printf("\nBad selection, please try again.\n");
		}
	} while ((*method_ptr) == NULL);

	do {
		printf("\nPlease enter a step size:\n");
		scanf("%f", h);
	} while (*h <= 0.);
}

int main(int argc, char* argv[])
{
	// Initialize clock to profile
	clock_t start = clock();

	// Initialize method specific variables and update them based on user input
	float h = -1.0; // step size
	float (*method_f_ptr)(float t, float y, float h) = NULL;
	char method_name_str[20];
	get_input(&method_f_ptr, method_name_str, &h);

	// Open files to write data to
	FILE* fp = NULL;
	fp = fopen(strcat(method_name_str, ".txt"), "w");

	float t0 = 0.; // t initial condition
	float y = 1.; // y initial condition
	float tf = 2.; // t that we want to approximate
	float tl = tf - h * 0.5;
	while (t0 < tl) {
		fprintf(fp, "%f\t %f\n", t0, y);
		y = (*method_f_ptr)(t0, y, h);
		t0 = t0 + h;
	}

	fprintf(fp, "%f\t %f\n", tf, y);
	printf("~~~ Results ~~~:\nFile: %s\nFinal Values:\nT: %f, Y:%f\n", method_name_str, tf, y);

	clock_t end = clock();
	double elapsed_time = (end - start) / (double)CLOCKS_PER_SEC;
	printf("Time to complete:\n%f seconds", elapsed_time);
	return 0;
}

